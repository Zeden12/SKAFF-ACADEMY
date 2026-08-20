import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{modules.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{assignments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">{materials.length}</p>
          </CardContent>
        </Card>
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
