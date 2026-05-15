"use client";

import { useState } from "react";
import Chat from "@/components/Chat";
import Landing from "@/components/Landing";

export default function Page() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Landing onStart={() => setStarted(true)} />;
  }

  return <Chat />;
}
