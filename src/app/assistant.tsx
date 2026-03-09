"use client";

import { useMemo, useState } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { MODELS } from "@/components/model-selector";
import { ModelProvider } from "@/components/model-context";
import { ThemeToggle } from "@/components/theme-toggle";

export const Assistant = () => {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  const transport = useMemo(
    () =>
      new AssistantChatTransport({
        api: "/api/chat",
        body: { model: selectedModel },
      }),
    [selectedModel],
  );

  const runtime = useChatRuntime({ transport });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ModelProvider
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      >
        <div className="flex h-dvh w-full flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
            <h1 className="font-semibold text-lg">AI Chat</h1>
            <ThemeToggle />
          </header>
          <div className="flex-1 overflow-hidden">
            <Thread />
          </div>
        </div>
      </ModelProvider>
    </AssistantRuntimeProvider>
  );
};
