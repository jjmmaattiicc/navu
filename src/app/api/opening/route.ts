import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { OPENING_MESSAGE_PROMPT } from "@/lib/navu";

const CLAUDE_MODEL =
  process.env.CLAUDE_MODEL?.trim() ?? "claude-sonnet-4-6";

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
    const body = (await request.json()) as {
      locale?: string;
      language?: string;
    };

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    if (!apiKey) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const languageTag = body.language?.trim() || body.locale?.trim() || "en";
    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 256,
      system: OPENING_MESSAGE_PROMPT,
      messages: [
        {
          role: "user",
          content: `The user's browser language tag is "${languageTag}". Write the opening message in that language.`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const message = textBlock?.type === "text" ? textBlock.text.trim() : "";

    if (!message) {
      return Response.json(
        { error: "Claude returned an empty response" },
        { status: 502 }
      );
    }

    return Response.json({ message });
  } catch (error) {
    const { message, status } = formatApiError(error);
    console.error("Opening API error:", message);
    return Response.json({ error: message }, { status });
  }
}
