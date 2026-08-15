import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Results" description="Published grades for your completed modules." />
      <EmptyState
        icon={GraduationCap}
        title="No results published"
        description="Your grades will appear here once released by the registrar."
      />
    </div>
  );
}
