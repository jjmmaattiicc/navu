"use client";

import { useEffect, useRef, useState } from "react";
import type { AppCopy } from "@/lib/i18n";
import type { Message } from "@/lib/navu";

type ChatProps = {
  copy: AppCopy;
  onBack: () => void;
};

export default function Chat({ copy, onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: copy.introMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [input]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
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

      if (!data.message) {
        throw new Error("No message in response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message! },
      ]);
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

      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto flex w-full max-w-[680px] flex-col gap-3">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} aria-hidden />
        </div>
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
            disabled={isLoading}
            className="max-h-80 min-h-[52px] flex-1 resize-none overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
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

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-[20px] px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "bg-[#2C2825] text-white"
            : "bg-[#F0EBE3] text-[#2C2825] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        }`}
      >
        {isUser ? message.content : formatAssistantMessage(message.content)}
      </div>
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
            <strong key={index} className="font-semibold text-[#2C2825]">
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
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-[20px] bg-[#F0EBE3] px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <span className="typing-dot h-2 w-2 rounded-full bg-[#2C2825]/35" />
        <span className="typing-dot typing-dot-delay-1 h-2 w-2 rounded-full bg-[#2C2825]/35" />
        <span className="typing-dot typing-dot-delay-2 h-2 w-2 rounded-full bg-[#2C2825]/35" />
      </div>
    </div>
  );
}
