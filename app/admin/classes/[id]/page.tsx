import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ClipboardList, FolderOpen, CheckSquare, GraduationCap, CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { AdminMetricCard } from "@/components/shared/admin-metric-card";
import { ClassSummaryCard } from "@/components/admin/class-summary-card";
import { ClassRosterTable, type ClassRosterRow } from "@/components/admin/class-roster-table";
import { ScheduleItem } from "@/components/student/schedule-item";
import { courseService } from "@/lib/services/course-service";
import { studentService } from "@/lib/services/student-service";
import { scheduleService } from "@/lib/services/schedule-service";
import { materialsService } from "@/lib/services/materials-service";
import { assignmentsService } from "@/lib/services/assignments-service";
import { attendanceService } from "@/lib/services/attendance-service";

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params;
  const classGroup = await courseService.getClassGroup(id);
  if (!classGroup) notFound();

  const intake = await courseService.getIntake(classGroup.intakeId);
  const program = intake ? await courseService.getProgram(intake.programId) : undefined;
  const trainer = classGroup.staffLeadId ? await courseService.getStaffMember(classGroup.staffLeadId) : undefined;

  const [roster, modules, upcomingSessions, assignments] = await Promise.all([
    studentService.listStudentsForClassGroup(id),
    program ? courseService.listModulesForProgram(program.id) : Promise.resolve([]),
    scheduleService.listUpcomingSessions(id),
    assignmentsService.listAssignmentsForClassGroup(id),
  ]);

  const moduleIds = modules.map((m) => m.id);
  const materials = await materialsService.listMaterialsForModules(moduleIds);
  const moduleNameById = Object.fromEntries(modules.map((m) => [m.id, m.title]));

  const rosterRows: ClassRosterRow[] = await Promise.all(
    roster.map(async (student) => {
      const user = await studentService.getUserForStudent(student.id);
      const attendance = await attendanceService.getAttendanceSummary(student.id);
      return {
        student,
        user: user!,
        attendanceRate: attendance.total > 0 ? attendance.presentRate : undefined,
      };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/classes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All classes
        </Link>
      </div>

      <ClassSummaryCard
        classGroup={classGroup}
        program={program}
        intake={intake}
        trainer={trainer}
        enrolledCount={roster.length}
      />

      <div>
        <h2 className="text-sm font-semibold text-foreground">Academic Operations</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <AdminMetricCard label="Modules" value={modules.length} icon={BookOpen} />
          <AdminMetricCard
            label="Materials"
            value={materials.length}
            icon={FolderOpen}
            href={`/admin/materials?class=${id}`}
          />
          <AdminMetricCard
            label="Assignments"
            value={assignments.length}
            icon={ClipboardList}
            href={`/admin/assignments?class=${id}`}
          />
          <AdminMetricCard label="Attendance" value="View" icon={CheckSquare} href={`/admin/attendance?class=${id}`} />
          <AdminMetricCard
            label="Results"
            value="View"
            icon={GraduationCap}
            href={`/admin/results?class=${id}`}
          />
          <AdminMetricCard label="Schedule" value="View" icon={CalendarDays} href={`/admin/schedule?class=${id}`} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Upcoming Sessions</h2>
        <div className="mt-3 space-y-3">
          {upcomingSessions.length === 0 ? (
            <EmptyState title="No upcoming sessions scheduled" />
          ) : (
            upcomingSessions.slice(0, 4).map((session) => (
              <ScheduleItem key={session.id} session={session} moduleName={moduleNameById[session.moduleId] ?? "—"} />
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Roster</h2>
        <div className="mt-3">
          <ClassRosterTable rows={rosterRows} />
        </div>
      </div>
    </div>
  );
}
