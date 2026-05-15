import { copy as translations } from "@/lib/translations";
import { getUiStrings, type UiStrings } from "@/lib/ui-copy";

export type Locale = keyof typeof translations;

type BaseCopy = (typeof translations)[Locale];

export type AppCopy = BaseCopy & UiStrings;

const copy = translations as Record<Locale, AppCopy>;

const LANGUAGE_TO_LOCALE: Record<string, Locale> = {
  en: "en",
  hr: "hr",
  de: "de",
  es: "es",
  fr: "fr",
  it: "it",
  pt: "pt",
  ru: "ru",
  pl: "pl",
  nl: "nl",
  tr: "tr",
  ar: "ar",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  sv: "sv",
  no: "no",
  nb: "no",
  nn: "no",
  da: "da",
  fi: "fi",
  cs: "cs",
  sk: "sk",
  hu: "hu",
  ro: "ro",
  bg: "bg",
  sr: "sr",
  bs: "bs",
  sl: "sl",
  uk: "uk",
  el: "el",
  he: "he",
  hi: "hi",
  bn: "bn",
  ur: "ur",
  fa: "fa",
  th: "th",
  vi: "vi",
  id: "id",
  ms: "ms",
  tl: "tl",
  fil: "tl",
  sw: "sw",
  af: "af",
  et: "et",
  lt: "lt",
  lv: "lv",
  mk: "mk",
  sq: "sq",
  mn: "mn",
  ne: "ne",
  pa: "pa",
  gu: "gu",
  ta: "ta",
  te: "te",
  kn: "kn",
  ha: "ha",
  yo: "yo",
  am: "am",
};

export function resolveLocale(browserLanguage: string): Locale {
  const normalized = browserLanguage.toLowerCase();

  if (
    normalized.startsWith("zh-tw") ||
    normalized.startsWith("zh-hk") ||
    normalized.startsWith("zh-mo") ||
    normalized.includes("hant")
  ) {
    return "zh-TW";
  }

  if (normalized.startsWith("zh")) {
    return "zh";
  }

  const base = normalized.split("-")[0];
  return LANGUAGE_TO_LOCALE[base] ?? "en";
}

export function getCopy(locale: Locale): AppCopy {
  return { ...copy[locale], ...getUiStrings(locale) };
}

export function getBrowserCopy(): AppCopy {
  if (typeof navigator === "undefined") {
    return copy.en;
  }

  return getCopy(resolveLocale(navigator.language));
}
