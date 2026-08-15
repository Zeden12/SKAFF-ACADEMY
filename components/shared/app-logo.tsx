import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants/site";

interface AppLogoProps {
  href?: string;
  className?: string;
  /** Show the tagline under the name (public marketing contexts only). */
  showTagline?: boolean;
  /** Render light text/mark for use on dark backgrounds (e.g. dashboard sidebar). */
  variant?: "default" | "on-dark";
}

export function AppLogo({
  href = "/",
  className,
  showTagline = false,
  variant = "default",
}: AppLogoProps) {
  const isOnDark = variant === "on-dark";

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label={`${SITE.name} home`}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md",
          isOnDark ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        <GraduationCap className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-sm font-bold tracking-wide uppercase",
            isOnDark ? "text-white" : "text-navy"
          )}
        >
          {SITE.name}
        </span>
        {showTagline && (
          <span className={cn("text-xs", isOnDark ? "text-slate-300" : "text-muted-foreground")}>
            {SITE.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
