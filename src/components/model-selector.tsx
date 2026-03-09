"use client";

import { type FC } from "react";
import { cn } from "@/lib/utils";
import { useModelContext } from "@/components/model-context";

export type ModelOption = {
  id: string;
  name: string;
  description: string;
};

export const MODELS: ModelOption[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    description: "Latest & fastest",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    description: "Most capable",
  },
  {
    id: "claude-opus-4-5-20251101",
    name: "Claude Opus 4.5",
    description: "Very capable",
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku 4.5",
    description: "Fast & cheap",
  },
  {
    id: "claude-sonnet-4-5-20250929",
    name: "Claude Sonnet 4.5",
    description: "Balanced",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    description: "Reliable",
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude Opus 4",
    description: "Strong reasoning",
  },
];

export const ComposerModelSelector: FC = () => {
  const { selectedModel, onModelChange } = useModelContext();

  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className={cn(
          "h-7 appearance-none rounded-lg border-none bg-transparent px-2 pr-6 text-xs text-muted-foreground",
          "outline-none transition-colors hover:text-foreground hover:bg-muted cursor-pointer",
        )}
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
        <svg
          className="size-3 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      </div>
    </div>
  );
};
