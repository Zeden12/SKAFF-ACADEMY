import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApplicationProgressStep {
  key: string;
  label: string;
}

interface ApplicationProgressProps {
  steps: ApplicationProgressStep[];
  currentIndex: number;
  className?: string;
}

export function ApplicationProgress({ steps, currentIndex, className }: ApplicationProgressProps) {
  return (
    <ol className={cn("flex items-start", className)} aria-label="Application progress">
      {steps.map((step, index) => {
        const state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming";
        const isLast = index === steps.length - 1;

        return (
          <li key={step.key} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  state === "complete" && "bg-primary text-primary-foreground",
                  state === "current" && "border-2 border-primary text-primary",
                  state === "upcoming" && "border border-border text-muted-foreground"
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "complete" ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden max-w-20 text-center text-xs font-medium sm:block",
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn("mx-2 h-px flex-1", state === "complete" ? "bg-primary" : "bg-border")}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
