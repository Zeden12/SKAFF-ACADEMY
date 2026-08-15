import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminAttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Record attendance for class sessions."
        actions={<Button disabled>Take Attendance</Button>}
      />
      <EmptyState
        icon={CheckSquare}
        title="No attendance records"
        description="Attendance records will appear here once taken."
      />
    </div>
  );
}
