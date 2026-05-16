"use client";

import { useEffect, useRef, useState } from "react";
import type { AppCopy, Locale } from "@/lib/i18n";
import { stripRoleLabels, type Message } from "@/lib/navu";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasUserMessage = messages.some((m) => m.role === "user");

  useEffect(() => {
    let cancelled = false;

    async function loadOpeningMessage() {
      try {
        const res = await fetch("/api/opening", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            language:
              typeof navigator !== "undefined"
                ? navigator.language
                : locale,
          }),
        });

        const data: { message?: string; error?: string } = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }

        if (!data.message) {
          throw new Error("No opening message in response");
        }

        if (!cancelled) {
          setWelcomeText(data.message);
        }
      } catch (err) {
        if (!cancelled) {
          const detail =
            err instanceof Error ? err.message : "Unknown error occurred";
          setWelcomeText(`Error: ${detail}`);
        }
      } finally {
        if (!cancelled) {
          setIntroLoading(false);
        }
      }
    }

    loadOpeningMessage();

    return () => {
      cancelled = true;
    };
  }, [locale]);

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

    const container = scrollRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, hasUserMessage]);

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

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setIsLoading(true);

    const apiMessages: Message[] = isFirstMessage
      ? [
          { role: "assistant", content: welcomeText },
          userMessage,
        ]
      : [...messages, userMessage];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      let data: { message?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned ${res.status} with no JSON body`);
      }

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      if (data.message?.trim()) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: stripRoleLabels(data.message!),
          },
        ]);
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
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF8F5]">
      <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-neutral-100 px-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="text-[14px] text-neutral-400 transition-colors hover:text-neutral-600"
        >
          ← {copy.backButton}
        </button>
        <h1 className="text-lg font-medium tracking-tight text-neutral-900">
          Navu
        </h1>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col">
        {showWelcomeOverlay && (
          <div
            className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
              welcomeFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {!introLoading && welcomeText && (
              <p className="absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 whitespace-pre-line px-6 text-center text-[1.8rem] leading-[2.4] text-[#3D3530]">
                {welcomeText}
              </p>
            )}
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
              <div ref={bottomRef} aria-hidden />
            </div>
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-neutral-100 bg-white px-4 py-4 sm:px-6">
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
            className="max-h-80 min-h-[52px] flex-1 resize-none overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || introLoading}
            className="shrink-0 rounded-2xl bg-neutral-900 px-5 py-3.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
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
        className="w-fit max-w-[65%] self-end bg-[#2C2825] px-4 py-2.5 text-left text-[15px] leading-[1.6] text-[#F5F2EC]"
        style={{ borderRadius: "18px 18px 4px 18px" }}
      >
        {stripRoleLabels(message.content)}
      </div>
    );
  }

  return (
    <div className="w-fit max-w-[65%] self-start bg-transparent px-1 py-0 text-left text-[15px] leading-[1.7] text-[#3D3530]">
      {formatAssistantMessage(stripRoleLabels(message.content))}
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
            <strong key={index} className="font-semibold text-[#3D3530]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-fit max-w-[65%] items-center gap-1.5 self-start px-1 py-0">
      <span className="typing-dot h-2 w-2 rounded-full bg-[#3D3530]/35" />
      <span className="typing-dot typing-dot-delay-1 h-2 w-2 rounded-full bg-[#3D3530]/35" />
      <span className="typing-dot typing-dot-delay-2 h-2 w-2 rounded-full bg-[#3D3530]/35" />
    </div>
  );
}
