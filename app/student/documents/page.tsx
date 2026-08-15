import { FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function StudentDocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Request official documents such as transcripts and enrollment letters."
        actions={<Button disabled>Request Document</Button>}
      />
      <EmptyState
        icon={FileText}
        title="No document requests yet"
        description="Requests you submit to the registrar will appear here."
      />
    </div>
  );
}
