"use client";

import { UIMessage } from "ai";
import { MarkdownRenderer } from "./markdown-renderer";
import { Bot, User, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group flex gap-3 py-4 px-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {isUser ? "You" : "Claude"}
        </span>

        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-blue-600 text-white"
              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          )}
        >
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return isUser ? (
                  <p key={i} className="whitespace-pre-wrap leading-7">
                    {part.text}
                  </p>
                ) : (
                  <div key={i} className="prose-sm max-w-none">
                    <MarkdownRenderer content={part.text} />
                  </div>
                );
              case "file":
                return (
                  <div key={i} className="my-1">
                    {part.mediaType.startsWith("image/") ? (
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={part.url}
                          alt={part.filename || "Uploaded image"}
                          className="max-h-64 max-w-full rounded-lg object-contain"
                        />
                        {part.filename && (
                          <span className="mt-1 flex items-center gap-1 text-xs opacity-70">
                            <ImageIcon size={12} />
                            {part.filename}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm">
                        <FileText size={16} />
                        <span>{part.filename || "File"}</span>
                      </div>
                    )}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
