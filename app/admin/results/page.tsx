import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        description="Enter and publish student results."
        actions={<Button disabled>Enter Results</Button>}
      />
      <EmptyState
        icon={GraduationCap}
        title="No results recorded"
        description="Results you enter for students will appear here."
      />
    </div>
  );
}
