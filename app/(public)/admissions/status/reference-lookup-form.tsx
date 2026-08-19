"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReferenceLookupForm() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = reference.trim();
    if (!trimmed) {
      setError("Enter your application reference number.");
      return;
    }
    router.push(`/admissions/status/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="reference">Application Reference</Label>
        <Input
          id="reference"
          placeholder="SKA-APP-2026-0001"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          aria-invalid={Boolean(error)}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <Button type="submit">
        <Search className="size-4" />
        Track Application
      </Button>
    </form>
  );
}
