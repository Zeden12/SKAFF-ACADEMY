import { FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentMaterialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Materials" description="Learning materials shared by your instructors." />
      <EmptyState
        icon={FolderOpen}
        title="No materials yet"
        description="Documents, slides, and links shared for your modules will appear here."
      />
    </div>
  );
}
