import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminAdmissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admissions" description="Review and process applications." />
      <EmptyState
        icon={ClipboardCheck}
        title="No applications yet"
        description="Submitted applications will appear here for review."
      />
    </div>
  );
}
