import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { admissionsService } from "@/lib/services/admissions-service";
import { documentsService } from "@/lib/services/documents-service";
import { scheduleService } from "@/lib/services/schedule-service";
import type { StudentStatus } from "@/lib/types";

export interface ProgramStudentCount {
  programId: string;
  programName: string;
  count: number;
}

export interface StudentStatusCount {
  status: StudentStatus;
  count: number;
}

export interface AdminDashboardSummary {
  activeStudents: number;
  onHoldOrSuspendedStudents: number;
  activeClasses: number;
  applicationsPendingReview: number;
  pendingDocumentRequests: number;
  sessionsTodayCount: number;
  sessionsThisWeekCount: number;
  studentsByProgram: ProgramStudentCount[];
  studentStatusDistribution: StudentStatusCount[];
}

const ATTENTION_STATUSES: StudentStatus[] = ["on_hold", "suspended"];

/**
 * Aggregates counts across the student, course, admissions, document, and schedule domains
 * for the admin dashboard. Every figure here is derived live from the same mock data the rest
 * of the app reads — nothing here is a hardcoded number.
 */
export const dashboardService = {
  async getSummary(): Promise<AdminDashboardSummary> {
    const [students, classGroups, programs, applicationCounts, documentRequests, sessionsToday, sessionsThisWeek] =
      await Promise.all([
        studentService.listStudents(),
        courseService.listAllClassGroups(),
        courseService.listPrograms(),
        admissionsService.getSummaryCounts(),
        documentsService.listAllRequests(),
        scheduleService.listSessionsToday(),
        scheduleService.listSessionsThisWeek(),
      ]);

    const activeStudents = students.filter((s) => s.status === "active").length;
    const onHoldOrSuspendedStudents = students.filter((s) => ATTENTION_STATUSES.includes(s.status)).length;
    const activeClasses = classGroups.filter((c) => c.status === "active").length;
    const applicationsPendingReview = applicationCounts.submitted + applicationCounts.under_review;
    const pendingDocumentRequests = documentRequests.filter(
      (d) => d.status === "submitted" || d.status === "under_review"
    ).length;

    const studentsByProgram: ProgramStudentCount[] = programs
      .map((program) => ({
        programId: program.id,
        programName: program.name,
        count: students.filter((s) => s.programId === program.id).length,
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);

    const statusOrder: StudentStatus[] = [
      "active",
      "pending_payment",
      "on_hold",
      "suspended",
      "completed",
      "withdrawn",
    ];
    const studentStatusDistribution: StudentStatusCount[] = statusOrder
      .map((status) => ({ status, count: students.filter((s) => s.status === status).length }))
      .filter((row) => row.count > 0);

    return {
      activeStudents,
      onHoldOrSuspendedStudents,
      activeClasses,
      applicationsPendingReview,
      pendingDocumentRequests,
      sessionsTodayCount: sessionsToday.length,
      sessionsThisWeekCount: sessionsThisWeek.length,
      studentsByProgram,
      studentStatusDistribution,
    };
  },
};
