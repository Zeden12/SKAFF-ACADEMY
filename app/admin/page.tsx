import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  Layers,
  AlertTriangle,
  CalendarDays,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AdminMetricCard } from "@/components/shared/admin-metric-card";
import { AttentionList } from "@/components/admin/attention-list";
import { ScheduleItem } from "@/components/student/schedule-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { STUDENT_STATUS_LABELS } from "@/lib/constants/student-portal";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants/admissions";
import { dashboardService } from "@/lib/services/dashboard-service";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { admissionsService } from "@/lib/services/admissions-service";
import { scheduleService } from "@/lib/services/schedule-service";
import { formatDate } from "@/lib/utils";

const ATTENTION_STATUSES = ["on_hold", "suspended"] as const;

export default async function AdminDashboardPage() {
  const [summary, students, programs, allModules, recentApplications, todaySessions] = await Promise.all([
    dashboardService.getSummary(),
    studentService.listStudents(),
    courseService.listPrograms(),
    courseService.listAllModules(),
    admissionsService.listApplications(),
    scheduleService.listSessionsToday(),
  ]);

  const moduleNameById = Object.fromEntries(allModules.map((m) => [m.id, m.title]));

  const attentionStudents = students.filter((s) => ATTENTION_STATUSES.includes(s.status as "on_hold" | "suspended"));
  const attentionRows = await Promise.all(
    attentionStudents.map(async (student) => {
      const user = await studentService.getUserForStudent(student.id);
      const program = programs.find((p) => p.id === student.programId);
      return user ? { user, student, programName: program?.name } : null;
    })
  );

  const maxProgramCount = Math.max(1, ...summary.studentsByProgram.map((p) => p.count));
  const totalStudents = summary.studentStatusDistribution.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="An operational overview of admissions, students, and campus activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminMetricCard label="Active Students" value={summary.activeStudents} icon={Users} href="/admin/students" />
        <AdminMetricCard
          label="Applications Pending Review"
          value={summary.applicationsPendingReview}
          icon={ClipboardCheck}
          href="/admin/admissions"
        />
        <AdminMetricCard label="Active Classes" value={summary.activeClasses} icon={Layers} href="/admin/classes" />
        <AdminMetricCard
          label="On Hold / Suspended"
          value={summary.onHoldOrSuspendedStudents}
          icon={AlertTriangle}
          tone={summary.onHoldOrSuspendedStudents > 0 ? "warning" : "default"}
          href="/admin/students?status=on_hold"
        />
        <AdminMetricCard
          label="Classes This Week"
          value={summary.sessionsThisWeekCount}
          icon={CalendarDays}
          href="/admin/classes"
        />
        <AdminMetricCard
          label="Pending Document Requests"
          value={summary.pendingDocumentRequests}
          icon={FileText}
          href="/admin/documents"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Students by Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.studentsByProgram.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enrolled students yet.</p>
            ) : (
              summary.studentsByProgram.map((row) => (
                <div key={row.programId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{row.programName}</span>
                    <span className="font-medium text-muted-foreground">{row.count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(row.count / maxProgramCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.studentStatusDistribution.map((row) => (
              <div key={row.status}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{STUDENT_STATUS_LABELS[row.status]}</span>
                  <span className="font-medium text-muted-foreground">
                    {row.count} · {Math.round((row.count / Math.max(1, totalStudents)) * 100)}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(row.count / Math.max(1, totalStudents)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Today&rsquo;s Classes</h2>
          <div className="mt-3 space-y-3">
            {todaySessions.length === 0 ? (
              <EmptyState title="No classes scheduled today" />
            ) : (
              todaySessions.map((session) => (
                <ScheduleItem key={session.id} session={session} moduleName={moduleNameById[session.moduleId] ?? "—"} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Students Requiring Attention</h2>
          <div className="mt-3">
            <AttentionList rows={attentionRows.filter((r): r is NonNullable<typeof r> => r !== null)} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Admissions Activity</h2>
          <Link href="/admin/admissions" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {recentApplications.length === 0 ? (
            <EmptyState title="No applications yet" />
          ) : (
            recentApplications.slice(0, 5).map((application) => (
              <Link
                key={application.id}
                href={`/admin/admissions/${application.reference}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:border-primary/40"
              >
                <div>
                  <span className="font-medium text-foreground">{application.personalInformation.fullName}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">{application.reference}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{APPLICATION_STATUS_LABELS[application.status]}</span>
                  <span>{formatDate(application.createdAt)}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
