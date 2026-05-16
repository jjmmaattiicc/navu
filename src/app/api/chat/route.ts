import Anthropic, { APIError } from "@anthropic-ai/sdk";
import {
  NAVU_SYSTEM_PROMPT,
  sanitizeMessageForApi,
  stripRoleLabels,
  type Message,
} from "@/lib/navu";

const CLAUDE_MODEL =
  process.env.CLAUDE_MODEL?.trim() ?? "claude-sonnet-4-6";

function isSilencePlaceholder(text: string): boolean {
  return /^\((ostaje\s+)?tišina\)$/i.test(text) || /^\(silence\)$/i.test(text);
}

function formatApiError(error: unknown): { message: string; status: number } {
  if (error instanceof APIError) {
    const body = error.error as { error?: { message?: string } } | undefined;
    const detail = body?.error?.message ?? error.message;
    return { message: detail, status: error.status ?? 500 };
  }

  if (error instanceof Error) {
    return { message: error.message, status: 500 };
  }

  return { message: String(error), status: 500 };
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    if (!messages?.length) {
      return Response.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: NAVU_SYSTEM_PROMPT,
      messages: messages.map((m) => sanitizeMessageForApi(m)),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const rawReply = textBlock?.type === "text" ? textBlock.text.trim() : "";
    const reply = stripRoleLabels(rawReply);

    if (!reply || isSilencePlaceholder(reply)) {
      return Response.json({ message: "" });
    }

    return Response.json({ message: reply });
  } catch (error) {
    const { message, status } = formatApiError(error);
    console.error("Chat API error:", message);
    return Response.json({ error: message }, { status });
  }
}
