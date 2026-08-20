import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminMetricCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  href?: string;
  tone?: "default" | "warning" | "destructive";
  className?: string;
}

export function AdminMetricCard({ label, value, icon: Icon, href, tone = "default", className }: AdminMetricCardProps) {
  const content = (
    <Card className={cn(href && "transition-colors hover:border-primary/40", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
          {Icon && (
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md",
                tone === "destructive" ? "bg-destructive/10" : tone === "warning" ? "bg-warning/10" : "bg-primary/10"
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-primary"
                )}
              />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
