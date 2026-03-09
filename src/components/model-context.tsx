"use client";

import { createContext, useContext, type ReactNode } from "react";

type ModelContextType = {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
};

const ModelContext = createContext<ModelContextType | null>(null);

export function useModelContext() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelContext must be used within ModelProvider");
  return ctx;
}

export function ModelProvider({
  selectedModel,
  onModelChange,
  children,
}: ModelContextType & { children: ReactNode }) {
  return (
    <ModelContext.Provider value={{ selectedModel, onModelChange }}>
      {children}
    </ModelContext.Provider>
  );
}
