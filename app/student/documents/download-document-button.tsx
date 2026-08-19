"use client";

import { useState } from "react";
import { Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadDocumentButton() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div>
      <Button type="button" size="sm" variant="outline" onClick={() => setShowNotice(true)}>
        <Download className="size-3.5" />
        Download Document
      </Button>
      {showNotice && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          This is a simulated action for this preview — document generation isn&rsquo;t connected yet.
        </p>
      )}
    </div>
  );
}
