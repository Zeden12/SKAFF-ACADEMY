import Link from "next/link";
import { CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ApplicationsClosedStateProps {
  programName: string;
  programSlug: string;
}

export function ApplicationsClosedState({ programName, programSlug }: ApplicationsClosedStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <CalendarOff className="size-6 text-muted-foreground" aria-hidden="true" />
        </span>
        <div className="max-w-md space-y-1.5">
          <p className="text-base font-semibold text-foreground">
            Applications are currently closed for {programName}.
          </p>
          <p className="text-sm text-muted-foreground">
            There is no open intake accepting applications for this program right now. Check back
            later, explore other programs, or contact admissions to be notified when the next
            intake opens.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href={`/programs/${programSlug}`}>Back to Program</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/programs">View Other Programs</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Contact Admissions</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
