"use client";

import { useEffect, useRef, useState } from "react";
import type { AppCopy } from "@/lib/i18n";
import type { Message } from "@/lib/navu";

type ChatProps = {
  copy: AppCopy;
};

export default function Chat({ copy }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: copy.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="shrink-0 border-b border-neutral-100 px-6 py-5">
        <h1 className="text-lg font-medium tracking-tight text-neutral-900">
          Navu
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="shrink-0 border-t border-neutral-100 bg-white px-4 py-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-end gap-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={copy.inputPlaceholder}
            rows={1}
            disabled={isLoading}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
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
      <div className="flex items-center gap-1 rounded-2xl bg-neutral-100 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
