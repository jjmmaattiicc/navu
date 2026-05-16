"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import Landing from "@/components/Landing";
import { useBrowserLocale } from "@/hooks/useBrowserLocale";

export default function Page() {
  const [started, setStarted] = useState(false);
  const { copy, locale, ready } = useBrowserLocale();

  if (!ready) {
    return <div className="min-h-dvh bg-white" />;
  }

  if (!started) {
    return <Landing copy={copy} onStart={() => setStarted(true)} />;
  }

  return <Chat copy={copy} locale={locale} onBack={() => setStarted(false)} />;
}
