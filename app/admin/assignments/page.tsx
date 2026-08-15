import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminAssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Create and manage assignments for class groups."
        actions={<Button disabled>Create Assignment</Button>}
      />
      <EmptyState
        icon={ClipboardList}
        title="No assignments yet"
        description="Assignments you create will appear here."
      />
    </div>
  );
}
