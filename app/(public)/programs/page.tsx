import { ProgramCard } from "@/components/shared/program-card";
import {
  PROGRAM_CATEGORIES,
  PROGRAM_CATEGORY_LABELS,
  PROGRAM_CATEGORY_DESCRIPTIONS,
} from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";

export default async function ProgramsPage() {
  const programs = await courseService.listPrograms();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Programs</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          SKAFF ACADEMY offers practical, industry-oriented training across technology, digital
          business, creative production, and professional development. Training is delivered
          primarily through physical classes on our Kigali campus.
        </p>
      </div>

      <div className="mt-10 space-y-14">
        {PROGRAM_CATEGORIES.map((category) => {
          const categoryPrograms = programs.filter((p) => p.category === category);
          if (categoryPrograms.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                {PROGRAM_CATEGORY_LABELS[category]}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {PROGRAM_CATEGORY_DESCRIPTIONS[category]}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
