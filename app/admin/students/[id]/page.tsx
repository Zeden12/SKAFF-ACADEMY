import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StudentSummary } from "@/components/admin/student-summary";
import { StudentStatusActions } from "@/components/admin/student-status-actions";
import { ProgressSummary } from "@/components/student/progress-summary";
import { AttendanceSummary } from "@/components/student/attendance-summary";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentRequestStatusBadge } from "@/components/shared/document-request-status-badge";
import {
  DOCUMENT_REQUEST_TYPE_LABELS,
  FEE_STATUS_LABELS,
  FEE_STATUS_TONE,
  STUDENT_STATUS_LABELS,
} from "@/lib/constants/student-portal";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { attendanceService } from "@/lib/services/attendance-service";
import { resultsService } from "@/lib/services/results-service";
import { feesService } from "@/lib/services/fees-service";
import { documentsService } from "@/lib/services/documents-service";
import { scheduleService, deriveModuleState } from "@/lib/services/schedule-service";
import { formatDate } from "@/lib/utils";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminStudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;
  const student = await studentService.getStudentProfile(id);
  if (!student) notFound();

  const user = await studentService.getUserForStudent(id);
  if (!user) notFound();

  const [program, intake, classGroup, statusHistory, attendanceSummary, results, feeSummary, feeRecords, documentRequests] =
    await Promise.all([
      courseService.getProgram(student.programId),
      courseService.getIntake(student.intakeId),
      student.classGroupId ? courseService.getClassGroup(student.classGroupId) : undefined,
      studentService.getStatusHistory(id),
      attendanceService.getAttendanceSummary(id),
      resultsService.listResultsForStudent(id),
      feesService.getFeeSummary(id),
      feesService.listFeeRecordsForStudent(id),
      documentsService.listRequestsForStudent(id),
    ]);

  const modules = await courseService.listModulesForProgram(student.programId);
  const allSessions = student.classGroupId ? await scheduleService.listSessionsForClassGroup(student.classGroupId) : [];
  const completedModules = modules.filter(
    (mod) => deriveModuleState(allSessions.filter((s) => s.moduleId === mod.id)) === "completed"
  ).length;
  const modulePercentage = modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          All students
        </Link>
      </div>

      <StudentSummary user={user} student={student} program={program} intake={intake} classGroup={classGroup} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Academic Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressSummary
              label="Modules Completed"
              valueLabel={`${completedModules} / ${modules.length}`}
              percentage={modulePercentage}
            />
            <AttendanceSummary summary={attendanceSummary} compact />
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Results</p>
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground">No results published yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {results.slice(0, 3).map((result) => (
                    <div key={result.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{result.assessmentName}</span>
                      <span className="font-medium text-foreground">
                        {result.score}/{result.maxScore} · Grade {result.grade}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {!feeSummary || feeRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground">No fee records for this student yet.</p>
            ) : (
              <div className="space-y-3">
                {feeRecords.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{fee.description}</span>
                    <StatusBadge status={fee.status} tone={FEE_STATUS_TONE[fee.status]} label={FEE_STATUS_LABELS[fee.status]} />
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-semibold text-foreground">
                    {feeSummary.currency} {feeSummary.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Document Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {documentRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No document requests submitted yet.</p>
          ) : (
            <div className="space-y-2">
              {documentRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{DOCUMENT_REQUEST_TYPE_LABELS[request.type]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{formatDate(request.requestedAt)}</span>
                    <DocumentRequestStatusBadge status={request.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Administration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentStatusActions studentId={student.id} currentStatus={student.status} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Student-Facing Message</p>
              <p className="mt-0.5 text-sm text-foreground">{student.statusMessage ?? "None set."}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Internal Note (staff only)</p>
              <p className="mt-0.5 text-sm text-foreground">{student.internalNotes ?? "None."}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Status History</p>
            {statusHistory.length === 0 ? (
              <EmptyState title="No status changes recorded yet" />
            ) : (
              <div className="space-y-3">
                {statusHistory.map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">
                        {STUDENT_STATUS_LABELS[entry.previousStatus]} → {STUDENT_STATUS_LABELS[entry.newStatus]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.timestamp)} · {entry.actorName}
                      </span>
                    </div>
                    {entry.publicMessage && (
                      <p className="mt-1 text-xs text-muted-foreground">Message: {entry.publicMessage}</p>
                    )}
                    {entry.internalNote && (
                      <p className="mt-1 text-xs text-muted-foreground">Internal: {entry.internalNote}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
