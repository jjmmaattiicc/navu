import {
  pickRandomOpeningMessage,
  resolveOpeningLanguage,
} from "@/lib/navu";

export async function POST(request: Request) {
  const acceptLanguage = request.headers.get("accept-language") ?? "en";
  const language = resolveOpeningLanguage(acceptLanguage);
  const message = pickRandomOpeningMessage(language);

  return new Response(message, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
