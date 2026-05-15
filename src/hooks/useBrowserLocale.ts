"use client";

import { useEffect, useState } from "react";
import {
  type AppCopy,
  type Locale,
  getBrowserCopy,
  getCopy,
  resolveLocale,
} from "@/lib/i18n";

export function useBrowserLocale() {
  const [locale, setLocale] = useState<Locale>("en");
  const [copy, setCopy] = useState<AppCopy>(getCopy("en"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const detected = resolveLocale(navigator.language);
    setLocale(detected);
    setCopy(getBrowserCopy());
    setReady(true);
  }, []);

  return { locale, copy, ready };
}
