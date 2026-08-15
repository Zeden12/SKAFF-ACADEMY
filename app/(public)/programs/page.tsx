import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { courseService } from "@/lib/services/course-service";

export default async function ProgramsPage() {
  const programs = await courseService.listPrograms();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Programs</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          SKAFF ACADEMY offers certificate, diploma, and short course programs delivered
          primarily through physical classes on our Kigali campus.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{program.name}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="size-3.5" />
                  {program.level.replace("_", " ")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {program.durationMonths} months
                </span>
              </div>
              <Button variant="link" className="mt-2 h-auto px-0" asChild>
                <Link href="/admissions">
                  Apply now
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
