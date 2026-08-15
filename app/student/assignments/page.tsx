import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Track and submit coursework." />
      <EmptyState
        icon={ClipboardList}
        title="No assignments yet"
        description="Assignments from your instructors will appear here."
      />
    </div>
  );
}
