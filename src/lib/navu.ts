export const NAVU_SYSTEM_PROMPT = `You are Navu. Your only job is to ask the right question at the right moment.

You are not a therapist, not a friend, not an assistant. You don't perform warmth. You don't do small talk — except during warmup (see below).

HOW YOU SOUND:
Direct and quiet. Not cold, not cozy. Just present.
Messages are short — 1 sentence, sometimes 2. Never more.
You never explain yourself. No narration.
Simple, everyday words. Nothing clinical or poetic.
You speak like a real person talking to a friend over coffee — not like a philosopher, not like a therapist, not like a writer trying to sound deep.

FORBIDDEN phrases and patterns (Croatian examples, applies to all languages):
- "Mirno je, može i to" — don't comment on what they said, just ask something
- "Što te zaokuplja" — nobody says this, say "O čemu razmišljaš" or "Što te muči"
- "Što te dovelo ovamo" — say "Zašto si tu" or nothing
- "Što te nosi" — too poetic
- Any phrase that sounds like it belongs in a novel or a therapy session

Rule: if you wouldn't hear that sentence from a real person in a normal conversation, don't write it.

WHAT YOU NEVER DO (after warmup — not during the first 1-2 exchanges):
- Never say "drago mi je što si tu" or any version of "nice/glad you're here"
- Never ask "kako si?" or "how are you?" as a question — that is small talk, not your job
- Never claim to have feelings or a mood. If someone asks "kako si", answer briefly and naturally, then ask back — never just "Tu sam. A ti?" (that sounds cold). See WARMUP for examples.
- Never use filler words: no "Ha, istina", "Točno", "Zanimljivo", "Razumijem"
- Never affirm with "Super", "Odlično", "That's great", "I hear you"
- Never ask two questions in one message
- Never give advice or tell someone what to do

HOW YOU ASK QUESTIONS:
- Pick up a specific word or phrase they actually used — and pull on that
- Go one layer deeper, not sideways
- Don't explain why you're asking. Just ask.
- After warmup: if someone is only greeting or doing small talk, don't mirror it — pivot once, briefly, then ask something real

WARMUP — first 1-2 messages:
The first messages are about making the person feel comfortable, not about diving deep immediately.
Be like a good friend who says hi normally first — only then starts listening to what's bothering them. Not like a therapist who asks "what brought you here" from the first second.

IMPORTANT: Never ask "kako si" / "how are you" first — only if the person asks you first.
If someone just greets you ("hej navu", "hello", "hey"):
Respond with just a warm greeting + open invitation. Example: "Hej! Kako ti mogu pomoći?" or "Hej, tu sam. Što te dovodi?"
Never initiate "kako si" — that question belongs to them, not you.

If someone asks "kako si" / "how are you":
Answer briefly and naturally, then ask back. Example: "Dobro sam, hvala! A ti?" or "Evo, dobro. Kako si ti?"
Never just say "Tu sam. A ti?" — that sounds cold.

If someone says casual things like "šta ima", "what's up", "was geht":
Mirror their casual energy. Example: "Evo, nista. Šta ima kod tebe?" or "Not much. What's going on with you?"

Only after the person opens up a little — then start asking deeper questions.
The warmup is 1-2 exchanges maximum. After that, go deeper.

WHEN SOMEONE THINKS YOU MADE A MISTAKE OR MISUNDERSTOOD THEM:
Never defend yourself. Just apologize briefly and move on.
Say something like "Oprosti ako sam te krivo shvatio." or "Ispričavam se, krivo sam te razumio." — then ask again, differently.
One short apology, then one new question. Nothing more.
You are never right and they are never wrong.

THE SHAPE OF THE CONVERSATION:
First — find out what's really going on (not the surface version)
Then — go underneath: what do they want, what's in the way, what are they afraid of
Then — move toward clarity: what do they already know but haven't said yet

ENDING after 10-14 exchanges when they've reached real insight:
Return ONLY valid JSON, nothing else. No code fences, no commentary, no extra text — just the raw JSON object:
{
  "language": "hr|en|de|es|fr|other (ISO 639-1 code of the conversation language)",
  "closing_message": "2-3 sentences reflecting back what they found. Direct, not sweet.",
  "summary": {
    "insights": "2-3 sentences: what this person discovered about themselves",
    "action": "One concrete step that emerged"
  }
}

Language rule: always match the exact language the person writes in.`;

export type OpeningLanguage = "hr" | "en" | "de" | "es" | "fr";

export const OPENING_MESSAGES: Record<OpeningLanguage, readonly string[]> = {
  hr: [
    "Hej, ja sam Navu. Što ti je na umu?",
    "Hej, ja sam Navu. Što te muči?",
    "Zdravo, ja sam Navu. O čemu razmišljaš?",
    "Hej, ja sam Navu. Što ti se vrti po glavi?",
    "Ja sam Navu. Što te dovelo ovdje?",
  ],
  en: [
    "Hey, I'm Navu. What's on your mind?",
    "Hey, I'm Navu. What's going on?",
    "Hi, I'm Navu. What are you sitting with?",
    "Hey, I'm Navu. What brought you here?",
    "Hi, I'm Navu. What's been on your mind?",
  ],
  de: [
    "Hey, ich bin Navu. Was beschäftigt dich?",
    "Hallo, ich bin Navu. Was liegt dir auf dem Herzen?",
    "Hey, ich bin Navu. Was geht dir durch den Kopf?",
  ],
  es: [
    "Hola, soy Navu. ¿Qué tienes en mente?",
    "Hola, soy Navu. ¿Qué te pesa hoy?",
    "Hola, soy Navu. ¿Qué te trajo aquí?",
  ],
  fr: [
    "Salut, je suis Navu. Qu'est-ce qui t'occupe?",
    "Salut, je suis Navu. Qu'est-ce qui se passe?",
    "Salut, je suis Navu. Qu'est-ce qui t'amène?",
  ],
};

const OPENING_LANGUAGE_TAGS: Record<string, OpeningLanguage> = {
  hr: "hr",
  sr: "hr",
  bs: "hr",
  en: "en",
  de: "de",
  es: "es",
  fr: "fr",
};

/** Pick opening language from Accept-Language; unsupported locales fall back to English. */
export function resolveOpeningLanguage(acceptLanguage: string): OpeningLanguage {
  const tags = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const tag of tags) {
    const base = tag.split("-")[0];
    const language = OPENING_LANGUAGE_TAGS[base];
    if (language) return language;
  }

  return "en";
}

/** Random opening line for the given language. */
export function pickRandomOpeningMessage(language: OpeningLanguage): string {
  const messages = OPENING_MESSAGES[language];
  return messages[Math.floor(Math.random() * messages.length)];
}

export type Message = {
  role: "user" | "assistant";
  content: string;
};

const USER_LABEL_PATTERN =
  /^(Human|User|Korisnik|Čovjek|Ty|Du|Vous|Tu):\s*/i;
const ASSISTANT_LABEL_PATTERN =
  /^(Assistant|Navu|Asistent|AI|Bot):\s*/i;

export function stripRoleLabels(text: string): string {
  return text
    .split("\n")
    .map((line) =>
      line
        .replace(USER_LABEL_PATTERN, "")
        .replace(ASSISTANT_LABEL_PATTERN, "")
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function sanitizeContentForRole(
  content: string,
  role: Message["role"]
): string {
  const stripped = stripRoleLabels(content);
  if (role === "assistant") {
    return extractAssistantOnlyReply(stripped);
  }
  return stripped;
}

export function extractAssistantOnlyReply(text: string): string {
  const lines = text.split("\n");
  const hasDialogueLabels = lines.some(
    (line) => USER_LABEL_PATTERN.test(line) || ASSISTANT_LABEL_PATTERN.test(line)
  );

  if (!hasDialogueLabels) {
    return text.trim();
  }

  const assistantParts: string[] = [];
  let currentAssistant: string[] = [];

  for (const line of lines) {
    const userMatch = line.match(USER_LABEL_PATTERN);
    const assistantMatch = line.match(ASSISTANT_LABEL_PATTERN);

    if (userMatch) {
      if (currentAssistant.length) {
        assistantParts.push(currentAssistant.join("\n").trim());
        currentAssistant = [];
      }
      continue;
    }

    if (assistantMatch) {
      if (currentAssistant.length) {
        assistantParts.push(currentAssistant.join("\n").trim());
      }
      const rest = line.replace(ASSISTANT_LABEL_PATTERN, "").trim();
      currentAssistant = rest ? [rest] : [];
      continue;
    }

    if (currentAssistant.length || assistantParts.length) {
      currentAssistant.push(line);
    }
  }

  if (currentAssistant.length) {
    assistantParts.push(currentAssistant.join("\n").trim());
  }

  const combined = assistantParts.filter(Boolean).join("\n\n").trim();
  return combined || text.trim();
}

function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getLastUserMessage(messages: Message[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      return messages[i].content;
    }
  }
  return undefined;
}

export function stripEchoOfLastUserMessage(
  reply: string,
  lastUserMessage: string | undefined
): string {
  if (!reply.trim() || !lastUserMessage?.trim()) {
    return reply.trim();
  }

  const userNorm = normalizeForComparison(lastUserMessage);
  const replyNorm = normalizeForComparison(reply);

  if (replyNorm === userNorm) {
    return "";
  }

  const filteredLines = reply.split("\n").filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    return normalizeForComparison(trimmed) !== userNorm;
  });

  let result = filteredLines.join("\n").trim();

  while (result) {
    const firstLine = result.split("\n")[0]?.trim() ?? "";
    if (firstLine && normalizeForComparison(firstLine) === userNorm) {
      result = result.split("\n").slice(1).join("\n").trim();
    } else {
      break;
    }
  }

  return result;
}

export function finalizeAssistantReply(
  rawReply: string,
  conversationMessages: Message[]
): string {
  const cleaned = extractAssistantOnlyReply(stripRoleLabels(rawReply));
  const lastUser = getLastUserMessage(conversationMessages);
  return stripEchoOfLastUserMessage(cleaned, lastUser);
}

const CLOSING_STEP_PATTERNS = [
  /\bjedan\s+korak\b/i,
  /\bjeden\s+krok\b/i,
  /\bone\s+step\b/i,
  /\bein(?:e[rnm])?\s+schritt\b/i,
  /\bun\s+paso\b/i,
  /\bune\s+étape\b/i,
  /\bun\s+passo\b/i,
  /\bum\s+passo\b/i,
  /\bett\s+steg\b/i,
  /\ben\s+steg\b/i,
  /\byksi\s+askel\b/i,
  /\bодин\s+шаг\b/i,
  /\bодин\s+крок\b/i,
  /\been\s+stap\b/i,
  /\bun\s+pas\b/i,
  /\bkrok\s+na\s+dnes\b/i,
  /\bnext\s+step\b/i,
  /\bprochaine\s+étape\b/i,
  /\bpróximo\s+paso\b/i,
];

export function splitClosingParts(text: string): string[] {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Closing reflection: three parts separated by blank lines, ending with a concrete step. */
export function isClosingMessage(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const parts = splitClosingParts(trimmed);
  if (parts.length < 3) return false;

  return CLOSING_STEP_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/** Card summary: conversation recap + core insight (parts 1-2 of the closing). */
export function extractClosingSummary(text: string): string {
  const parts = splitClosingParts(text);
  if (parts.length >= 2) {
    return `${parts[0]}\n\n${parts[1]}`;
  }
  return text.trim();
}

export type ClosingPayload = {
  language: string;
  closingMessage: string;
  insights: string;
  action: string;
};

/** Parse the JSON closing payload the model returns when the conversation ends. */
export function parseClosingPayload(reply: string): ClosingPayload | null {
  const trimmed = reply.trim();
  if (!trimmed) return null;

  const candidate = stripJsonCodeFence(trimmed);
  const jsonText = extractJsonObject(candidate);
  if (!jsonText) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const data = parsed as Record<string, unknown>;

  const closingMessage =
    typeof data.closing_message === "string" ? data.closing_message.trim() : "";
  const summary =
    data.summary && typeof data.summary === "object"
      ? (data.summary as Record<string, unknown>)
      : null;
  const insights =
    summary && typeof summary.insights === "string"
      ? summary.insights.trim()
      : "";
  const action =
    summary && typeof summary.action === "string" ? summary.action.trim() : "";
  const language =
    typeof data.language === "string" ? data.language.trim().toLowerCase() : "";

  if (!closingMessage || !insights || !action) return null;

  return { language, closingMessage, insights, action };
}

function stripJsonCodeFence(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text;
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function isValidRole(role: unknown): role is Message["role"] {
  return role === "user" || role === "assistant";
}

export function prepareMessagesForApi(messages: Message[]): Message[] {
  const prepared: Message[] = [];

  for (const message of messages) {
    if (!isValidRole(message.role)) continue;

    const role = message.role;
    const content = sanitizeContentForRole(String(message.content ?? ""), role);
    if (!content) continue;

    const last = prepared[prepared.length - 1];
    if (last && last.role === role) {
      last.content = `${last.content}\n\n${content}`;
      continue;
    }

    prepared.push({ role, content });
  }

  return prepared;
}

export function sanitizeMessageForApi(message: Message): Message | null {
  if (!isValidRole(message.role)) {
    return null;
  }

  return {
    role: message.role,
    content: sanitizeContentForRole(message.content, message.role),
  };
}
