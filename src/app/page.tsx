"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import Landing from "@/components/Landing";
import { useBrowserLocale } from "@/hooks/useBrowserLocale";

export default function Page() {
  const [started, setStarted] = useState(false);
  const { copy, ready } = useBrowserLocale();

  if (!ready) {
    return <div className="min-h-dvh bg-white" />;
  }

  if (!started) {
    return <Landing copy={copy} onStart={() => setStarted(true)} />;
  }

  return <Chat copy={copy} onBack={() => setStarted(false)} />;
}
