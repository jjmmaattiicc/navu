"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AppCopy, Locale } from "@/lib/i18n";
import { finalizeAssistantReply, type Message } from "@/lib/navu";
import { formatInsightForClipboard } from "@/lib/share-insight";
import { getSummaryLabels } from "@/lib/ui-copy";

type ClosingState = {
  insights: string;
  action: string;
  language: string;
};

type ChatProps = {
  copy: AppCopy;
  locale: Locale;
  onBack: () => void;
};

export default function Chat({ copy, locale, onBack }: ChatProps) {
  const [welcomeText, setWelcomeText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [introLoading, setIntroLoading] = useState(true);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true);
  const [welcomeFading, setWelcomeFading] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [closingSummary, setClosingSummary] = useState<ClosingState | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const openingFetchId = useRef(0);

  const hasUserMessage = messages.some((m) => m.role === "user");

  const loadOpeningMessage = useCallback(async () => {
    const fetchId = ++openingFetchId.current;
    setIntroLoading(true);
    setWelcomeText("");

    try {
      const res = await fetch("/api/opening", { method: "POST" });

      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const message = (await res.text()).trim();

      if (!message) {
        throw new Error("No opening message in response");
      }

      if (fetchId === openingFetchId.current) {
        setWelcomeText(message);
      }
    } catch (err) {
      if (fetchId === openingFetchId.current) {
        const detail =
          err instanceof Error ? err.message : "Unknown error occurred";
        setWelcomeText(`Error: ${detail}`);
      }
    } finally {
      if (fetchId === openingFetchId.current) {
        setIntroLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadOpeningMessage();
  }, [loadOpeningMessage]);

  function startNewConversation() {
    openingFetchId.current += 1;
    setMessages([]);
    setClosingSummary(null);
    setInput("");
    setIsLoading(false);
    setShowWelcomeOverlay(true);
    setWelcomeFading(false);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    loadOpeningMessage();
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (!hasUserMessage || welcomeFading) return;

    setWelcomeFading(true);
    const timer = window.setTimeout(() => {
      setShowWelcomeOverlay(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [hasUserMessage, welcomeFading]);

  useEffect(() => {
    if (!hasUserMessage) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, hasUserMessage, closingSummary]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [input]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading || introLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const isFirstMessage = !hasUserMessage;

    const historyForApi: Message[] = isFirstMessage
      ? [
          { role: "assistant", content: welcomeText },
          userMessage,
        ]
      : [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      let data: {
        message?: string;
        error?: string;
        isClosing?: boolean;
        summary?: string;
        action?: string;
        language?: string;
      };
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned ${res.status} with no JSON body`);
      }

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const assistantContent = data.message
        ? finalizeAssistantReply(data.message, historyForApi)
        : "";

      if (assistantContent.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: assistantContent,
          },
        ]);

        if (data.isClosing) {
          setClosingSummary({
            insights: data.summary?.trim() || assistantContent.trim(),
            action: data.action?.trim() ?? "",
            language: data.language?.trim() || locale,
          });
        }
      }
    } catch (err) {
      const detail =
        err instanceof Error ? err.message : "Unknown error occurred";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${detail}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF7F2]">
      <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-[#D4C4B0]/60 px-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="text-[14px] text-[#7A5040] transition-colors hover:text-[#2C1810]"
        >
          ← {copy.backButton}
        </button>
        <h1 className="text-lg font-medium tracking-tight text-[#2C1810]">
          Navu
        </h1>
        {hasUserMessage && (
          <button
            type="button"
            onClick={startNewConversation}
            className="ml-auto rounded-full border border-[#D4C4B0] bg-[#F0E8DC] px-3.5 py-1.5 text-[13px] font-medium text-[#2C1810] transition-colors hover:border-[#7A5040] hover:bg-[#E8DBC9]"
          >
            {copy.newConversationButton}
          </button>
        )}
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col">
        {showWelcomeOverlay && (
          <div
            className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
              welcomeFading ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="grid w-full max-w-3xl place-items-center">
                <div
                  className={`col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                    introLoading ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={!introLoading}
                >
                  <WelcomeLoadingDots />
                </div>
              {welcomeText && (
                  <p
                    className={`col-start-1 row-start-1 whitespace-pre-line text-center text-[1.2rem] leading-[2.4] text-[#2C1810] transition-opacity duration-300 md:text-[1.8rem] ${
                      introLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {welcomeText}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {hasUserMessage && (
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-scroll px-4 py-6"
          >
            <div className="mx-auto flex w-full max-w-[680px] flex-col gap-5">
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              {closingSummary && (
                <ClosingSummaryCard
                  insights={closingSummary.insights}
                  action={closingSummary.action}
                  language={closingSummary.language}
                  onNewConversation={startNewConversation}
                />
              )}
              <div ref={bottomRef} aria-hidden />
            </div>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-[#D4C4B0]/60 bg-[#FAF7F2] px-4 py-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-[680px] items-end gap-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={copy.inputPlaceholder}
            rows={2}
            disabled={isLoading || introLoading}
            className="max-h-80 min-h-[52px] flex-1 resize-none overflow-y-auto rounded-2xl border border-[#D4C4B0] bg-[#F0E8DC] px-4 py-3 text-[15px] leading-relaxed text-[#2C1810] placeholder:text-[#A89580] focus:border-[#7A5040] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || introLoading}
            className="shrink-0 rounded-2xl bg-[#5C3D2E] px-5 py-3.5 text-[15px] font-medium text-[#FAF7F2] shadow-sm transition-colors hover:bg-[#7A5040] disabled:cursor-not-allowed disabled:bg-[#D4C4B0] disabled:text-[#A89580]"
          >
            {copy.sendButton}
          </button>
        </form>
      </footer>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className="w-fit max-w-[65%] self-end bg-[#5C3D2E] px-4 py-2.5 text-left text-[15px] leading-[1.6] text-[#FAF7F2]"
        style={{ borderRadius: "18px 18px 4px 18px" }}
      >
        {message.content}
      </div>
    );
  }

  return (
    <div className="w-fit max-w-[65%] self-start bg-transparent px-1 py-0 text-left text-[15px] leading-[1.7] text-[#2C1810]">
      {formatAssistantMessage(message.content)}
    </div>
  );
}

function formatAssistantMessage(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className="whitespace-pre-line">
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-[#2C1810]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

function ClosingSummaryCard({
  insights,
  action,
  language,
  onNewConversation,
}: {
  insights: string;
  action: string;
  language: string;
  onNewConversation: () => void;
}) {
  const labels = getSummaryLabels(language);
  const [copied, setCopied] = useState(false);

  const clipboardBody = action
    ? `${insights}\n\n${labels.actionLabel}: ${action}`
    : insights;

  async function handleShare() {
    const text = formatInsightForClipboard(
      labels.shareClipboardHeader,
      clipboardBody,
      labels.shareClipboardFooter
    );

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  }

  return (
    <div className="mt-2 w-full rounded-2xl border border-[#D4C4B0]/60 bg-[#F0E8DC] px-6 py-6 shadow-[0_2px_12px_rgba(44,24,16,0.06)]">
      <h2 className="text-[17px] font-medium tracking-tight text-[#2C1810]">
        {labels.title}
      </h2>
      <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.75] text-[#5C3D2E]">
        {formatAssistantMessage(insights)}
      </p>
      {action && (
        <div className="mt-5 rounded-xl bg-[#FAF7F2] px-4 py-4">
          <p className="text-[13px] font-medium uppercase tracking-wide text-[#7A5040]">
            {labels.actionLabel}
          </p>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.6] text-[#2C1810]">
            {formatAssistantMessage(action)}
          </p>
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-2xl border border-[#D4C4B0] bg-[#FAF7F2] px-5 py-3 text-[14px] font-medium text-[#2C1810] transition-colors hover:border-[#7A5040] hover:bg-[#F0E8DC]"
        >
          {copied ? labels.shareCopiedLabel : labels.shareInsightLabel}
        </button>
        <button
          type="button"
          onClick={onNewConversation}
          className="rounded-2xl bg-[#5C3D2E] px-5 py-3 text-[14px] font-medium text-[#FAF7F2] transition-colors hover:bg-[#7A5040] sm:ml-auto"
        >
          {labels.newConversationLabel}
        </button>
      </div>
    </div>
  );
}

function WelcomeLoadingDots() {
  return (
    <>
      <span className="welcome-pulse-dot h-2 w-2 rounded-full bg-[#5C3D2E]" />
      <span className="welcome-pulse-dot welcome-pulse-dot-delay-1 h-2 w-2 rounded-full bg-[#5C3D2E]" />
      <span className="welcome-pulse-dot welcome-pulse-dot-delay-2 h-2 w-2 rounded-full bg-[#5C3D2E]" />
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-fit max-w-[65%] items-center gap-1.5 self-start px-1 py-0">
      <span className="typing-dot h-2 w-2 rounded-full bg-[#5C3D2E]/35" />
      <span className="typing-dot typing-dot-delay-1 h-2 w-2 rounded-full bg-[#5C3D2E]/35" />
      <span className="typing-dot typing-dot-delay-2 h-2 w-2 rounded-full bg-[#5C3D2E]/35" />
    </div>
  );
}
