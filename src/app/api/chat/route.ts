import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText, type UIMessage, type ModelMessage } from "ai";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

const DOCX_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const XLSX_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

async function extractDocxText(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function extractXlsxText(base64: string): string {
  const buffer = Buffer.from(base64, "base64");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheets: string[] = [];
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    sheets.push(`[Sheet: ${name}]\n${csv}`);
  }
  return sheets.join("\n\n");
}

export const maxDuration = 60;

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

async function uiMessagesToModelMessages(messages: UIMessage[]): Promise<ModelMessage[]> {
  return Promise.all(messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map(async (m) => {
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
            let decoded: string;
            const raw = b64Match[1];

            if (DOCX_TYPES.includes(part.mediaType)) {
              decoded = await extractDocxText(raw);
            } else if (XLSX_TYPES.includes(part.mediaType)) {
              decoded = extractXlsxText(raw);
            } else {
              decoded = Buffer.from(raw, "base64").toString("utf-8");
            }

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
    })) as unknown as ModelMessage[];
}

const ALLOWED_MODELS = [
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "claude-opus-4-5-20251101",
  "claude-haiku-4-5-20251001",
  "claude-sonnet-4-5-20250929",
  "claude-opus-4-1-20250805",
  "claude-opus-4-20250514",
  "claude-sonnet-4-20250514",
];

export async function POST(req: Request) {
  try {
    const { messages, model: requestedModel } = (await req.json()) as {
      messages: UIMessage[];
      model?: string;
    };

    const modelId =
      requestedModel && ALLOWED_MODELS.includes(requestedModel)
        ? requestedModel
        : "claude-sonnet-4-6";

    const modelMessages = await uiMessagesToModelMessages(messages);

    const result = streamText({
      model: anthropic(modelId),
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
