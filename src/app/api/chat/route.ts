import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, type UIMessage, type ModelMessage } from "ai";

export const maxDuration = 60;

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

function uiMessagesToModelMessages(messages: UIMessage[]): ModelMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      if (m.role === "assistant") {
        const text = m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");
        return { role: "assistant" as const, content: text };
      }

      const content: Array<
        | { type: "text"; text: string }
        | { type: "image"; image: string | URL; mimeType?: string }
        | { type: "file"; data: string | URL; mimeType: string }
      > = [];

      for (const part of m.parts) {
        if (part.type === "text") {
          content.push({ type: "text", text: part.text });
        } else if (part.type === "file" && part.url) {
          const b64Match = part.url.match(/^data:[^;]+;base64,(.+)$/);
          if (part.mediaType.startsWith("image/")) {
            content.push({
              type: "image",
              image: b64Match ? b64Match[1] : new URL(part.url),
              mimeType: part.mediaType,
            });
          } else if (b64Match) {
            const decoded = Buffer.from(b64Match[1], "base64").toString(
              "utf-8"
            );
            content.push({
              type: "text",
              text: `[File: ${part.filename || "unknown"}]\n${decoded}`,
            });
          } else {
            content.push({
              type: "file",
              data: new URL(part.url),
              mimeType: part.mediaType,
            });
          }
        }
      }

      return {
        role: "user" as const,
        content:
          content.length === 1 && content[0].type === "text"
            ? content[0].text
            : content,
      };
    }) as ModelMessage[];
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: UIMessage[];
    };

    const modelMessages = uiMessagesToModelMessages(messages);

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system:
        "You are a helpful AI assistant. You provide clear, accurate, and well-formatted responses using Markdown when appropriate. You can analyze images and files that users share with you.",
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat] Error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
