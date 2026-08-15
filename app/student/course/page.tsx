import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentCoursePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Course" description="Modules and course structure for your program." />
      <EmptyState
        icon={BookOpen}
        title="Course details coming soon"
        description="Module breakdowns for your enrolled program will appear here."
      />
    </div>
  );
}
