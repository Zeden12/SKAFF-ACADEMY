import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/components/shared/application-status-badge";
import { admissionsService } from "@/lib/services/admissions-service";
import { courseService } from "@/lib/services/course-service";

interface ConfirmationPageProps {
  params: Promise<{ reference: string }>;
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { reference } = await params;
  const application = await admissionsService.getApplicationByReference(reference);

  if (!application) {
    notFound();
  }

  const program = await courseService.getProgram(application.programId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-7 text-success" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-foreground sm:text-3xl">
        Application Submitted
      </h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Thank you for applying to SKAFF ACADEMY. Keep your reference number to track your
        application status at any time.
      </p>

      <Card className="mt-8 text-left">
        <CardHeader>
          <CardTitle className="text-base">Application Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-mono text-lg font-semibold text-foreground">{application.reference}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Program</span>
            <span className="font-medium text-foreground">{program?.name ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <ApplicationStatusBadge status={application.status} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-5 text-left text-sm text-muted-foreground">
        <p className="font-medium text-foreground">What happens next?</p>
        <p className="mt-1">
          Our admissions team will review your application and documents. If anything else is
          needed, we&rsquo;ll let you know through your application status page. You can check
          back anytime using your reference number.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" asChild>
          <Link href={`/admissions/status/${application.reference}`}>View Application Status</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
