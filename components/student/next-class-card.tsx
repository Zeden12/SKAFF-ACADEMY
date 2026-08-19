import { CalendarX2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleItem } from "@/components/student/schedule-item";
import type { ClassSession } from "@/lib/types";

interface NextClassCardProps {
  session?: ClassSession;
  moduleName?: string;
  trainerName?: string;
}

export function NextClassCard({ session, moduleName, trainerName }: NextClassCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Next Class</CardTitle>
      </CardHeader>
      <CardContent>
        {session ? (
          <ScheduleItem session={session} moduleName={moduleName ?? "—"} trainerName={trainerName} className="border-0 p-0" />
        ) : (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CalendarX2 className="size-4" />
            No upcoming class sessions scheduled yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
