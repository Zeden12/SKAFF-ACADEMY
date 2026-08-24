import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceRosterForm, type AttendanceRosterRow } from "@/components/admin/attendance-roster-form";
import { courseService } from "@/lib/services/course-service";
import { studentService } from "@/lib/services/student-service";
import { scheduleService } from "@/lib/services/schedule-service";
import { attendanceService } from "@/lib/services/attendance-service";
import { ClassSessionPicker } from "./class-session-picker";

interface AdminAttendancePageProps {
  searchParams: Promise<{ class?: string; session?: string }>;
}

export default async function AdminAttendancePage({ searchParams }: AdminAttendancePageProps) {
  const { class: selectedClassId = "", session: selectedSessionId = "" } = await searchParams;

  const [classGroups, intakes, programs, allModules] = await Promise.all([
    courseService.listAllClassGroups(),
    courseService.listAllIntakes(),
    courseService.listPrograms(),
    courseService.listAllModules(),
  ]);

  const intakeToProgramId = new Map(intakes.map((i) => [i.id, i.programId]));
  const programNameById = new Map(programs.map((p) => [p.id, p.name]));
  const moduleNameById = Object.fromEntries(allModules.map((m) => [m.id, m.title]));

  const classGroupOptions = classGroups.map((c) => ({
    ...c,
    programName: programNameById.get(intakeToProgramId.get(c.intakeId) ?? "") ?? "—",
  }));

  const sessionsForClass = selectedClassId
    ? await scheduleService.listSessionsEligibleForAttendance(selectedClassId)
    : [];

  let rosterRows: AttendanceRosterRow[] = [];
  if (selectedSessionId) {
    const roster = await studentService.listStudentsForClassGroup(selectedClassId);
    const existingRecords = await attendanceService.getAttendanceForSession(selectedSessionId);
    rosterRows = await Promise.all(
      roster.map(async (student) => {
        const user = await studentService.getUserForStudent(student.id);
        return {
          student,
          user: user!,
          existingRecord: existingRecords.find((r) => r.studentId === student.id),
        };
      })
    );
  }

  const selectedSession = sessionsForClass.find((s) => s.id === selectedSessionId);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Take and review attendance for class sessions." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Class &amp; Session</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassSessionPicker
            classGroups={classGroupOptions}
            sessions={sessionsForClass}
            moduleNameById={moduleNameById}
            selectedClassId={selectedClassId}
            selectedSessionId={selectedSessionId}
          />
        </CardContent>
      </Card>

      {selectedSessionId && selectedSession ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedSession.title} — {moduleNameById[selectedSession.moduleId] ?? "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rosterRows.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No students enrolled in this class"
                description="Enroll students in this class before recording attendance."
              />
            ) : (
              <AttendanceRosterForm classSessionId={selectedSessionId} rows={rosterRows} />
            )}
          </CardContent>
        </Card>
      ) : selectedClassId ? (
        <EmptyState
          icon={CheckSquare}
          title="Select a session"
          description="Choose a completed or in-progress session to record or review its attendance."
        />
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="Select a class to begin"
          description="Choose a class above, then a session, to record or review attendance."
        />
      )}
    </div>
  );
}
