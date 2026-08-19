import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { AssignmentStatusBadge } from "@/components/shared/assignment-status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StudentOverviewCard } from "@/components/student/student-overview-card";
import { NextClassCard } from "@/components/student/next-class-card";
import { AttendanceSummary } from "@/components/student/attendance-summary";
import { FeeStatusCard } from "@/components/student/fee-status-card";
import { MaterialList } from "@/components/student/material-list";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { announcementService } from "@/lib/services/announcement-service";
import { scheduleService } from "@/lib/services/schedule-service";
import { materialsService } from "@/lib/services/materials-service";
import { assignmentsService } from "@/lib/services/assignments-service";
import { attendanceService } from "@/lib/services/attendance-service";
import { feesService } from "@/lib/services/fees-service";
import { resultsService } from "@/lib/services/results-service";

export default async function StudentDashboardPage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Dashboard" description="No student account found." />;
  }
  const { profile: student, user } = current;

  const [program, intake, classGroup, announcements] = await Promise.all([
    courseService.getProgram(student.programId),
    courseService.getIntake(student.intakeId),
    student.classGroupId ? courseService.getClassGroup(student.classGroupId) : undefined,
    announcementService.listAnnouncementsForStudentProgram(student.programId),
  ]);

  const classGroupId = student.classGroupId;
  const modules = await courseService.listModulesForProgram(student.programId);
  const moduleIds = modules.map((m) => m.id);

  const [nextSession, recentMaterials, assignments, attendanceSummary, resultsSummary] = await Promise.all([
    classGroupId ? scheduleService.getNextSession(classGroupId) : undefined,
    materialsService.listRecentMaterials(moduleIds, 3),
    classGroupId ? assignmentsService.listAssignmentsForClassGroup(classGroupId) : [],
    attendanceService.getAttendanceSummary(student.id),
    resultsService.getResultsSummary(student.id),
  ]);

  const nextSessionModule = nextSession ? modules.find((m) => m.id === nextSession.moduleId) : undefined;
  const trainer = classGroup?.staffLeadId ? await courseService.getStaffMember(classGroup.staffLeadId) : undefined;

  const submissions = await assignmentsService.listSubmissionsForStudent(student.id);
  const upcomingAssignments = assignments
    .map((a) => ({ assignment: a, submission: submissions.find((s) => s.assignmentId === a.id) }))
    .filter(({ submission }) => !submission || submission.status === "not_submitted")
    .slice(0, 3);

  const [firstFee] = await feesService.listFeeRecordsForStudent(student.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user.fullName.split(" ")[0]}`}
        description="Here's what's happening with your studies today."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <StudentOverviewCard student={student} program={program} intake={intake} classGroup={classGroup} />
        <NextClassCard session={nextSession} moduleName={nextSessionModule?.title} trainerName={trainer?.user.fullName} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceSummary summary={attendanceSummary} compact />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Fee Status</CardTitle>
          </CardHeader>
          <CardContent>
            {firstFee ? (
              <FeeStatusCard feeRecord={firstFee} compact />
            ) : (
              <p className="text-sm text-muted-foreground">No fee records yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Academic Update</CardTitle>
          </CardHeader>
          <CardContent>
            {resultsSummary.latestResult ? (
              <div>
                <p className="text-sm font-medium text-foreground">{resultsSummary.latestResult.assessmentName}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {resultsSummary.latestResult.score}/{resultsSummary.latestResult.maxScore}
                </p>
                <p className="text-xs text-muted-foreground">
                  Grade {resultsSummary.latestResult.grade} · Average {resultsSummary.averagePercentage}%
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No results published yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Upcoming Assignments</h2>
            <Link href="/student/assignments" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {upcomingAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">You&rsquo;re all caught up — no pending assignments.</p>
            ) : (
              upcomingAssignments.map(({ assignment, submission }) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm">{assignment.title}</CardTitle>
                      <AssignmentStatusBadge status={submission?.status ?? "not_submitted"} />
                    </div>
                    <CardDescription>Due {new Date(assignment.dueAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Materials</h2>
            <Link href="/student/materials" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3">
            <MaterialList
              materials={recentMaterials}
              moduleNameById={Object.fromEntries(modules.map((m) => [m.id, m.title]))}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Latest Announcements</h2>
          <Link href="/student/announcements" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {announcements.slice(0, 2).map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle className="text-sm">{announcement.title}</CardTitle>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
