import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** Once real SKAFF Academy photography exists, pass its path here to render it in place of the placeholder. */
  src?: string;
  alt: string;
  label?: string;
  icon?: LucideIcon;
  aspectClassName?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Neutral image slot for content that doesn't have real photography yet. Keeps the same
 * `src`/`alt` contract as a real image so callers don't change when photos are added later.
 */
export function ImagePlaceholder({
  src,
  alt,
  label,
  icon: Icon = ImageIcon,
  aspectClassName = "aspect-video",
  className,
  priority,
  sizes = "100vw",
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", aspectClassName, className)}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted",
        aspectClassName,
        className
      )}
    >
      <Icon className="size-8 text-muted-foreground/60" aria-hidden="true" />
      {label && (
        <span className="px-4 text-center text-xs font-medium text-muted-foreground/80">
          {label}
        </span>
      )}
    </div>
  );
}
