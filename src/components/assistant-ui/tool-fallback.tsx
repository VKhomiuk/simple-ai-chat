"use client";

import type { FC } from "react";

export const ToolFallback: FC = () => {
  return (
    <div className="aui-tool-fallback mb-4 flex w-full flex-col gap-3 rounded-lg border border-border/50 bg-muted/20 p-4">
      <p className="font-medium text-muted-foreground text-sm">
        Tool call in progress...
      </p>
    </div>
  );
};
