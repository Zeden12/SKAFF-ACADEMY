"use client";

import { useState } from "react";
import { FileText, Video, Link as LinkIcon, PresentationIcon, Download, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import type { LearningMaterial } from "@/lib/types";

const TYPE_CONFIG = {
  document: { icon: FileText, label: "Document" },
  video: { icon: Video, label: "Video" },
  link: { icon: LinkIcon, label: "Link" },
  slide_deck: { icon: PresentationIcon, label: "Slides" },
} as const;

interface MaterialListProps {
  materials: LearningMaterial[];
  moduleNameById: Record<string, string>;
}

export function MaterialList({ materials, moduleNameById }: MaterialListProps) {
  if (materials.length === 0) {
    return <EmptyState title="No materials yet" description="Materials shared by your instructor will appear here." />;
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <MaterialRow key={material.id} material={material} moduleName={moduleNameById[material.moduleId] ?? "—"} />
      ))}
    </div>
  );
}

function MaterialRow({ material, moduleName }: { material: LearningMaterial; moduleName: string }) {
  const [showNotice, setShowNotice] = useState(false);
  const { icon: Icon, label } = TYPE_CONFIG[material.type];

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Icon className="size-4 text-primary" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{material.title}</p>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
          <p className="text-xs text-muted-foreground">{moduleName}</p>
          {material.description && <p className="mt-1 text-sm text-muted-foreground">{material.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>Published {formatDate(material.uploadedAt)}</span>
            {material.fileSizeKb && <span>{(material.fileSizeKb / 1024).toFixed(1)} MB</span>}
          </div>

          <div className="mt-3">
            {material.externalUrl ? (
              <Button size="sm" variant="outline" asChild>
                <a href={material.externalUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="size-3.5" />
                  Open Resource
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setShowNotice(true)}>
                <Download className="size-3.5" />
                Download
              </Button>
            )}
            {showNotice && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                This is a simulated action for this preview — file storage isn&rsquo;t connected yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
