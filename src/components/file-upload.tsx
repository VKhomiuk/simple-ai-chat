"use client";

import { useCallback, useRef } from "react";
import { Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  file: File;
  preview?: string;
}

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "text/html",
  "text/markdown",
  "application/json",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export function FileUpload({ files, onFilesChange, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const validFiles: UploadedFile[] = [];
      for (const file of Array.from(newFiles)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          alert(`Unsupported file type: ${file.type}`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          alert(`File too large: ${file.name} (max 20MB)`);
          continue;
        }

        const uploaded: UploadedFile = { file };
        if (file.type.startsWith("image/")) {
          uploaded.preview = URL.createObjectURL(file);
        }
        validFiles.push(uploaded);
      }

      onFilesChange([...files, ...validFiles]);
    },
    [files, onFilesChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      const file = files[index];
      if (file.preview) URL.revokeObjectURL(file.preview);
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange]
  );

  return (
    <div className="flex items-end gap-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
          "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700",
          "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-label="Attach file"
      >
        <Paperclip size={18} />
      </button>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              {f.preview ? (
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-8 w-8 rounded object-cover"
                />
              ) : f.file.type.startsWith("image/") ? (
                <ImageIcon size={16} className="text-zinc-500" />
              ) : (
                <FileText size={16} className="text-zinc-500" />
              )}
              <span className="max-w-[120px] truncate text-zinc-700 dark:text-zinc-300">
                {f.file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-1 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                aria-label={`Remove ${f.file.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
