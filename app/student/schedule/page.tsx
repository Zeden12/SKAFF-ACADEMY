import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ScheduleItem } from "@/components/student/schedule-item";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { scheduleService } from "@/lib/services/schedule-service";
import type { ClassSession } from "@/lib/types";

function groupByDay(sessions: ClassSession[]): { day: string; sessions: ClassSession[] }[] {
  const groups = new Map<string, ClassSession[]>();
  for (const session of sessions) {
    const day = new Date(session.startsAt).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(session);
  }
  return Array.from(groups.entries()).map(([day, sessions]) => ({ day, sessions }));
}

export default async function StudentSchedulePage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Schedule" description="No student account found." />;
  }
  const { profile: student } = current;

  const modules = await courseService.listModulesForProgram(student.programId);
  const trainer = undefined; // trainer shown per-session isn't required; classGroup-level trainer covered on course page

  const classGroupId = student.classGroupId;
  const upcoming = classGroupId ? await scheduleService.listUpcomingSessions(classGroupId) : [];
  const past = classGroupId ? await scheduleService.listPastSessions(classGroupId) : [];

  const upcomingGroups = groupByDay(upcoming);
  const recentPast = [...past].reverse().slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="Your upcoming physical, online, and offsite class sessions."
      />

      {upcomingGroups.length === 0 ? (
        <EmptyState
          title="No upcoming sessions"
          description="Your class timetable will appear here once sessions are published."
        />
      ) : (
        <div className="space-y-6">
          {upcomingGroups.map(({ day, sessions }) => (
            <div key={day}>
              <h2 className="text-sm font-semibold text-foreground">{day}</h2>
              <div className="mt-3 space-y-3">
                {sessions.map((session) => {
                  const mod = modules.find((m) => m.id === session.moduleId);
                  return (
                    <ScheduleItem
                      key={session.id}
                      session={session}
                      moduleName={mod?.title ?? "—"}
                      trainerName={trainer}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {recentPast.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground">Recently Completed</h2>
          <div className="mt-3 space-y-3">
            {recentPast.map((session) => {
              const mod = modules.find((m) => m.id === session.moduleId);
              return <ScheduleItem key={session.id} session={session} moduleName={mod?.title ?? "—"} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
