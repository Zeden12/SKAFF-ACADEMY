import Link from "next/link";
import { Code2, Megaphone, Clapperboard, Briefcase, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import {
  PROGRAM_CATEGORY_LABELS,
  LEARNING_MODE_LABELS,
} from "@/lib/constants/programs";
import { PROGRAM_IMAGES } from "@/lib/constants/media";
import type { Program, ProgramCategory } from "@/lib/types";

const CATEGORY_ICONS: Record<ProgramCategory, typeof Code2> = {
  technology: Code2,
  digital_business: Megaphone,
  creative_production: Clapperboard,
  professional_development: Briefcase,
};

interface ProgramCardProps {
  program: Program;
  className?: string;
}

export function ProgramCard({ program, className }: ProgramCardProps) {
  return (
    <Card className={className}>
      <div className="px-(--card-spacing)">
        <ImagePlaceholder
          src={PROGRAM_IMAGES[program.slug]}
          alt={`${program.name} training at SKAFF ACADEMY`}
          label={program.name}
          icon={CATEGORY_ICONS[program.category]}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
        />
      </div>
      <CardHeader>
        <StatusBadge
          status={program.category}
          tone="info"
          label={PROGRAM_CATEGORY_LABELS[program.category]}
          className="w-fit"
        />
        <CardTitle className="text-base">{program.name}</CardTitle>
        <CardDescription>{program.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {program.learningModes.map((mode) => (
            <span key={mode}>{LEARNING_MODE_LABELS[mode]}</span>
          ))}
          {program.durationMonths && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {program.durationMonths} months
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm">
          <Link href={`/admissions/apply?program=${program.slug}`}>Apply</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/programs/${program.slug}`}>
            Details
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
