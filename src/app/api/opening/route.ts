import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { OPENING_MESSAGE_PROMPT } from "@/lib/navu";

/** Fastest model for short welcome copy only; chat route is unchanged. */
const OPENING_MODEL = "claude-haiku-4-5";

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

    const stream = await anthropic.messages.create({
      model: OPENING_MODEL,
      max_tokens: 60,
      stream: true,
      system: OPENING_MESSAGE_PROMPT,
      messages: [
        {
          role: "user",
          content: `The user's browser language tag is "${languageTag}". Write the opening message in that language.`,
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const { message, status } = formatApiError(error);
    console.error("Opening API error:", message);
    return Response.json({ error: message }, { status });
  }
}
