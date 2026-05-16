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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const behavior = messages.length <= 2 ? "auto" : "smooth";
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    });
  }, [messages, isLoading]);

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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
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

      <div className="flex h-[calc(100vh-60px)] min-h-0 flex-col">
        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col justify-end overflow-y-auto px-4 py-6"
        >
          <div className="mx-auto flex w-full max-w-[680px] flex-col gap-3">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} aria-hidden />
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
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl bg-neutral-100 px-4 py-3.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-neutral-400" />
        <span className="typing-dot typing-dot-delay-1 h-2 w-2 rounded-full bg-neutral-400" />
        <span className="typing-dot typing-dot-delay-2 h-2 w-2 rounded-full bg-neutral-400" />
      </div>
    </div>
  );
}
