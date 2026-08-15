import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Your attendance record across class sessions." />
      <EmptyState
        icon={CheckSquare}
        title="No attendance records yet"
        description="Attendance taken by your instructors will appear here."
      />
    </div>
  );
}
