import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Process student document requests." />
      <EmptyState
        icon={FileText}
        title="No document requests"
        description="Requests submitted by students will appear here."
      />
    </div>
  );
}
