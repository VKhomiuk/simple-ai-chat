"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-md bg-white/10 p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-white/20 hover:text-zinc-200 group-hover:opacity-100"
      aria-label="Copy code"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          if (match) {
            return (
              <div className="group relative my-3 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800/50 px-4 py-1.5">
                  <span className="text-xs font-medium text-zinc-400">
                    {match[1]}
                  </span>
                  <CopyButton code={codeString} />
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: "transparent",
                    padding: "1rem",
                    fontSize: "0.85rem",
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code
              className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:bg-zinc-800 dark:text-pink-400"
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-3 leading-7 last:mb-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="mb-3 list-disc pl-6 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return (
            <ol className="mb-3 list-decimal pl-6 space-y-1">{children}</ol>
          );
        },
        li({ children }) {
          return <li className="leading-7">{children}</li>;
        },
        h1({ children }) {
          return (
            <h1 className="mb-3 mt-6 text-2xl font-bold first:mt-0">
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2 className="mb-3 mt-5 text-xl font-bold first:mt-0">
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3 className="mb-2 mt-4 text-lg font-semibold first:mt-0">
              {children}
            </h3>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="mb-3 border-l-4 border-zinc-300 pl-4 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
              {children}
            </blockquote>
          );
        },
        a({ children, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400"
            >
              {children}
            </a>
          );
        },
        table({ children }) {
          return (
            <div className="mb-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="bg-zinc-50 px-4 py-2 text-left text-sm font-semibold dark:bg-zinc-800">
              {children}
            </th>
          );
        },
        td({ children }) {
          return <td className="px-4 py-2 text-sm">{children}</td>;
        },
        hr() {
          return (
            <hr className="my-4 border-zinc-200 dark:border-zinc-700" />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
