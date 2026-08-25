import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { courseService } from "@/lib/services/course-service";
import { scheduleService } from "@/lib/services/schedule-service";
import { formatDate } from "@/lib/utils";
import type { ClassSession } from "@/lib/types";
import { ScheduleFilters } from "./schedule-filters";

interface SessionRow extends ClassSession {
  classGroupName: string;
  moduleTitle: string;
  trainerName: string;
}

interface AdminSchedulePageProps {
  searchParams: Promise<{ class?: string; range?: string }>;
}

export default async function AdminSchedulePage({ searchParams }: AdminSchedulePageProps) {
  const { class: classGroupId, range = "upcoming" } = await searchParams;

  const [classGroups, modules, sessionsForRange] = await Promise.all([
    courseService.listAllClassGroups(),
    courseService.listAllModules(),
    range === "upcoming"
      ? scheduleService.listAllUpcomingSessions()
      : range === "past"
        ? scheduleService.listAllPastSessions()
        : scheduleService.listAllSessions(),
  ]);

  let sessions = sessionsForRange;
  if (classGroupId) sessions = sessions.filter((s) => s.classGroupId === classGroupId);

  const rows: SessionRow[] = await Promise.all(
    sessions.map(async (session) => {
      const classGroup = classGroups.find((c) => c.id === session.classGroupId);
      const mod = modules.find((m) => m.id === session.moduleId);
      const trainer = await courseService.getStaffMember(session.staffId);
      return {
        ...session,
        classGroupName: classGroup?.name ?? "—",
        moduleTitle: mod?.title ?? "—",
        trainerName: trainer?.user.fullName ?? "—",
      };
    })
  );

  const columns: DataTableColumn<SessionRow>[] = [
    { header: "Date", accessor: (row) => formatDate(row.startsAt) },
    {
      header: "Time",
      accessor: (row) =>
        `${new Date(row.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${new Date(row.endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
    },
    { header: "Session", accessor: (row) => row.title },
    { header: "Class", accessor: (row) => row.classGroupName },
    { header: "Module", accessor: (row) => row.moduleTitle },
    { header: "Trainer", accessor: (row) => row.trainerName },
    { header: "Mode", accessor: (row) => <StatusBadge status={row.mode} tone="neutral" label={LEARNING_MODE_LABELS[row.mode]} /> },
    { header: "Location", accessor: (row) => row.location ?? (row.onlineUrl ? "Online" : "—") },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/schedule/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Manage physical, online, and offsite class sessions."
        actions={
          <Button asChild>
            <Link href="/admin/schedule/new">Add Session</Link>
          </Button>
        }
      />

      <ScheduleFilters classGroups={classGroups} />

      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(row) => row.id}
        emptyTitle="No sessions match these filters"
        emptyDescription="Sessions you create will appear here."
      />
    </div>
  );
}
