import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AttendanceStatusBadge } from "@/components/shared/attendance-status-badge";
import { AttendanceSummary } from "@/components/student/attendance-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { scheduleService } from "@/lib/services/schedule-service";
import { attendanceService } from "@/lib/services/attendance-service";
import { formatDate } from "@/lib/utils";

export default async function StudentAttendancePage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Attendance" description="No student account found." />;
  }

  const [records, summary, modules] = await Promise.all([
    attendanceService.listAttendanceForStudent(current.profile.id),
    attendanceService.getAttendanceSummary(current.profile.id),
    courseService.listModulesForProgram(current.profile.programId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Your attendance record across class sessions." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceSummary summary={summary} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Session History</h2>
        {records.length === 0 ? (
          <EmptyState title="No attendance records yet" className="mt-3" />
        ) : (
          <div className="mt-3 space-y-2">
            {await Promise.all(
              records.map(async (record) => {
                const session = await scheduleService.getSession(record.classSessionId);
                const mod = session ? modules.find((m) => m.id === session.moduleId) : undefined;
                return (
                  <div
                    key={record.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{session?.title ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">
                        {mod?.title ?? "—"} · {session ? formatDate(session.startsAt) : "—"}
                      </p>
                      {record.note && <p className="mt-1 text-xs text-muted-foreground italic">{record.note}</p>}
                    </div>
                    <AttendanceStatusBadge status={record.status} />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
