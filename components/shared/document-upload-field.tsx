"use client";

import { useRef, useState } from "react";
import { Upload, FileCheck2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface UploadedFileMeta {
  fileName: string;
  fileType: string;
  fileSizeKb: number;
}

interface DocumentUploadFieldProps {
  id: string;
  label: string;
  required?: boolean;
  value: UploadedFileMeta | null;
  onChange: (file: UploadedFileMeta | null) => void;
  error?: string;
  accept?: string;
  maxSizeKb?: number;
}

/**
 * Frontend-only document selection. Nothing is uploaded anywhere — this only tracks selection
 * metadata (name/type/size) so the rest of the UI has something real to display and submit.
 */
export function DocumentUploadField({
  id,
  label,
  required = false,
  value,
  onChange,
  error,
  accept = "image/*,.pdf",
  maxSizeKb = 5120,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const displayError = error ?? localError;

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    const fileSizeKb = Math.round(file.size / 1024);
    if (fileSizeKb > maxSizeKb) {
      setLocalError(`File is too large. Maximum size is ${Math.round(maxSizeKb / 1024)}MB.`);
      return;
    }

    setLocalError(null);
    onChange({ fileName: file.name, fileType: file.type || "unknown", fileSizeKb });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && (
          <>
            {" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </>
        )}
      </Label>

      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full items-center gap-3 rounded-md border border-dashed px-4 py-3 text-left text-sm transition-colors hover:bg-muted",
            displayError ? "border-destructive" : "border-border"
          )}
        >
          <Upload className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Select file to upload</span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileCheck2 className="size-4 shrink-0 text-success" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{value.fileName}</p>
              <p className="text-xs text-muted-foreground">{(value.fileSizeKb / 1024).toFixed(1)} MB</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
              Replace
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-invalid={Boolean(displayError)}
        onChange={(event) => handleFiles(event.target.files)}
      />

      {displayError ? (
        <p className="text-xs text-destructive">{displayError}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Selected on this device only — document upload storage is not connected yet.
        </p>
      )}
    </div>
  );
}
