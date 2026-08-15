import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Your upcoming physical, online, and offsite class sessions."
      />
      <EmptyState
        icon={CalendarDays}
        title="No sessions scheduled"
        description="Your class timetable will appear here once sessions are published."
      />
    </div>
  );
}
