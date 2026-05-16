import Anthropic, { APIError } from "@anthropic-ai/sdk";
import {
  finalizeAssistantReply,
  NAVU_SYSTEM_PROMPT,
  prepareMessagesForApi,
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

function toAnthropicMessages(
  messages: Message[]
): Array<{ role: "user" | "assistant"; content: string }> {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    console.log("[chat] incoming messages:", JSON.stringify(messages, null, 2));

    if (!messages?.length) {
      return Response.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const preparedMessages = prepareMessagesForApi(messages);

    console.log(
      "[chat] prepared for API:",
      JSON.stringify(preparedMessages, null, 2)
    );

    if (!preparedMessages.length) {
      return Response.json(
        { error: "No valid messages in history" },
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
    const anthropicMessages = toAnthropicMessages(preparedMessages);

    console.log(
      "[chat] anthropic payload:",
      JSON.stringify(anthropicMessages, null, 2)
    );

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: NAVU_SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const rawReply = textBlock?.type === "text" ? textBlock.text.trim() : "";

    console.log("[chat] raw AI reply:", rawReply);

    const reply = finalizeAssistantReply(rawReply, preparedMessages);

    console.log("[chat] final assistant reply:", reply);

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
