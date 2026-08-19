import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ScheduleItem } from "@/components/student/schedule-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { scheduleService, deriveModuleState, type ModuleProgressState } from "@/lib/services/schedule-service";
import { materialsService } from "@/lib/services/materials-service";
import { assignmentsService } from "@/lib/services/assignments-service";

export default async function StudentCoursePage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="My Course" description="No student account found." />;
  }
  const { profile: student } = current;

  const [program, classGroup, modules] = await Promise.all([
    courseService.getProgram(student.programId),
    student.classGroupId ? courseService.getClassGroup(student.classGroupId) : undefined,
    courseService.listModulesForProgram(student.programId),
  ]);

  const trainer = classGroup?.staffLeadId ? await courseService.getStaffMember(classGroup.staffLeadId) : undefined;
  const classGroupId = student.classGroupId;
  const allSessions = classGroupId ? await scheduleService.listSessionsForClassGroup(classGroupId) : [];
  const upcomingSessions = classGroupId ? await scheduleService.listUpcomingSessions(classGroupId) : [];

  const moduleRows = await Promise.all(
    modules.map(async (mod) => {
      const sessions = allSessions.filter((s) => s.moduleId === mod.id);
      const moduleState = deriveModuleState(sessions);

      const [materials, assignments] = await Promise.all([
        materialsService.listMaterialsForModule(mod.id),
        assignmentsService.listAssignmentsForClassGroup(classGroupId ?? ""),
      ]);
      const moduleAssignments = assignments.filter((a) => a.moduleId === mod.id);

      return { mod, state: moduleState, materialsCount: materials.length, assignmentsCount: moduleAssignments.length };
    })
  );

  const completedCount = moduleRows.filter((m) => m.state === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader title="My Course" description="Your program structure, modules, and schedule." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{program?.name ?? "—"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Class" value={classGroup?.name ?? "—"} />
            <Field label="Status" value={<StatusBadge status={student.status} />} />
            <Field
              label="Learning Mode"
              value={program?.learningModes.map((m) => LEARNING_MODE_LABELS[m]).join(", ") ?? "—"}
            />
            <Field label="Trainer" value={trainer?.user.fullName ?? "—"} />
            <Field label="Modules Completed" value={`${completedCount} / ${moduleRows.length}`} />
            <Field label="Home Room" value={classGroup?.homeRoom ?? "—"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
            ) : (
              upcomingSessions.slice(0, 2).map((session) => {
                const mod = modules.find((m) => m.id === session.moduleId);
                return (
                  <ScheduleItem key={session.id} session={session} moduleName={mod?.title ?? "—"} className="p-3" />
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Modules</h2>
        {moduleRows.length === 0 ? (
          <EmptyState title="No modules published yet" className="mt-3" />
        ) : (
          <div className="mt-3 space-y-2">
            {moduleRows.map(({ mod, state, materialsCount, assignmentsCount }) => (
              <div key={mod.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <ModuleStateIcon state={state} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {mod.code} — {mod.title}
                    </p>
                    <ModuleStateLabel state={state} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{mod.description}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {mod.creditHours} credit hours · {materialsCount} materials · {assignmentsCount} assignments
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleStateIcon({ state }: { state: ModuleProgressState }) {
  if (state === "completed") return <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />;
  if (state === "current") return <CircleDot className="mt-0.5 size-5 shrink-0 text-primary" />;
  return <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/40" />;
}

function ModuleStateLabel({ state }: { state: ModuleProgressState }) {
  const label = state === "completed" ? "Completed" : state === "current" ? "In Progress" : "Upcoming";
  return (
    <span
      className={
        state === "completed"
          ? "text-xs font-medium text-success"
          : state === "current"
            ? "text-xs font-medium text-primary"
            : "text-xs font-medium text-muted-foreground"
      }
    >
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
