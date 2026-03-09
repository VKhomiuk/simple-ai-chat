"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback, type FormEvent } from "react";
import { Send, Loader2, Square, Sparkles } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { FileUpload, type UploadedFile } from "./file-upload";
import { cn } from "@/lib/utils";

function fileToFileUIPart(file: File): Promise<{ type: "file"; mediaType: string; url: string; filename: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        type: "file",
        mediaType: file.type,
        url: reader.result as string,
        filename: file.name,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    onError: (err) => {
      console.error("[chat client] Error:", err);
    },
  });
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if ((!input.trim() && files.length === 0) || isStreaming) return;

      const fileParts = await Promise.all(
        files.map((f) => fileToFileUIPart(f.file))
      );

      const parts: ({ type: "text"; text: string } | { type: "file"; mediaType: string; url: string; filename: string })[] = [];

      if (input.trim()) {
        parts.push({ type: "text", text: input.trim() });
      }
      parts.push(...fileParts);

      sendMessage({ parts });

      setInput("");
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFiles([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    },
    [input, files, isStreaming, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-lg shadow-violet-500/25">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              AI Chat
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Powered by Claude
            </p>
          </div>
        </div>
        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 size={14} className="animate-spin" />
            Thinking…
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-32 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-lg shadow-violet-500/20">
                <Sparkles size={28} />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                How can I help you today?
              </h2>
              <p className="max-w-md text-zinc-500 dark:text-zinc-400">
                Ask me anything, share files or images, and I&apos;ll do my
                best to assist you. Responses are rendered with full Markdown
                support.
              </p>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {error && (
                <div className="mx-4 my-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                  <strong>Error:</strong> {error.message}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-3xl px-4 py-4">
          {/* File previews */}
          {files.length > 0 && (
            <div className="mb-3">
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                disabled={isStreaming}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            {/* Attach button */}
            {files.length === 0 && (
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                disabled={isStreaming}
              />
            )}

            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                rows={1}
                disabled={isStreaming}
                className={cn(
                  "w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-12 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors",
                  "focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20",
                  "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500",
                  "dark:focus:border-violet-500 dark:focus:bg-zinc-900",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>

            {isStreaming ? (
              <button
                type="button"
                onClick={() => stop()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                aria-label="Stop generating"
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() && files.length === 0}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                  "bg-gradient-to-r from-violet-500 to-blue-600 text-white shadow-lg shadow-violet-500/25",
                  "hover:from-violet-600 hover:to-blue-700",
                  "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                )}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            )}
          </form>

          <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Claude may produce inaccurate information. Verify important details.
          </p>
        </div>
      </div>
    </div>
  );
}
