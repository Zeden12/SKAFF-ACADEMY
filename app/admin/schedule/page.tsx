import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function AdminSchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Manage physical, online, and offsite class sessions."
        actions={<Button disabled>Add Session</Button>}
      />
      <EmptyState
        icon={CalendarDays}
        title="No sessions scheduled"
        description="Class sessions you create will appear here."
      />
    </div>
  );
}
