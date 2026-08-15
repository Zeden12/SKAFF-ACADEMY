import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { courseService } from "@/lib/services/course-service";

const STEPS = [
  {
    title: "Submit your application",
    description: "Complete the application form online or at the campus registrar's office.",
  },
  {
    title: "Upload required documents",
    description: "National ID, academic transcripts, and a passport photo.",
  },
  {
    title: "Application review",
    description: "The admissions team reviews your application against the intake deadline.",
  },
  {
    title: "Confirmation and enrollment",
    description: "Accepted applicants complete registration and are placed into a class group.",
  },
];

export default async function AdmissionsPage() {
  const intakes = await courseService.listIntakesForProgram("prog-1");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Admissions</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Our admissions process is straightforward. Review the steps below and apply before
          the intake deadline.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </div>
              <CardDescription className="pl-8">{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {intakes.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Current Intake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {intakes.map((intake) => (
              <div key={intake.id} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>
                  {intake.label} — applications close {intake.applicationDeadline}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Button size="lg" asChild>
          <Link href="/contact">Contact Admissions Office</Link>
        </Button>
      </div>
    </div>
  );
}
