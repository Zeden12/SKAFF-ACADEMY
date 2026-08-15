import { FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminMaterialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Materials"
        description="Upload and manage learning materials for each module."
        actions={<Button disabled>Upload Material</Button>}
      />
      <EmptyState
        icon={FolderOpen}
        title="No materials uploaded"
        description="Materials you upload for modules will appear here."
      />
    </div>
  );
}
