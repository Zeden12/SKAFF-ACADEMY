import type { Assignment, AssignmentStatus, Submission, SubmissionStatus } from "@/lib/types";
import { assignments, submissions } from "@/lib/mock-data/assignments";

export interface SubmitAssignmentInput {
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  note?: string;
}

export interface CreateAssignmentInput {
  moduleId: string;
  classGroupId: string;
  title: string;
  description: string;
  status: AssignmentStatus;
  dueAt: string;
  maxScore: number;
  allowResubmission: boolean;
  attachmentFileName?: string;
  attachmentFileSizeKb?: number;
  createdByStaffId: string;
}

export type UpdateAssignmentInput = Partial<Omit<CreateAssignmentInput, "createdByStaffId">>;

export interface AssignmentFilters {
  query?: string;
  moduleId?: string;
  classGroupId?: string;
  status?: AssignmentStatus;
}

export interface ReviewSubmissionInput {
  status: Extract<SubmissionStatus, "reviewed" | "graded">;
  score?: number;
  feedback?: string;
  reviewedByStaffId: string;
}

/**
 * Assignment and submission data access. Mock-backed for now; submissions and assignments
 * mutate in-memory arrays as a stand-in database for this frontend-first phase — a real
 * backend can later own persistence without changing calling UI code. Both the student and
 * admin portals read/write through this same module, so a review made here is immediately
 * visible on the student's assignment detail page.
 */
export const assignmentsService = {
  // --- Student-facing (draft hidden) ---

  async listAssignmentsForClassGroup(classGroupId: string): Promise<Assignment[]> {
    return [...assignments.filter((a) => a.classGroupId === classGroupId && a.status !== "draft")].sort(
      (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    );
  },

  async getAssignment(assignmentId: string): Promise<Assignment | undefined> {
    return assignments.find((a) => a.id === assignmentId);
  },

  async getSubmission(assignmentId: string, studentId: string): Promise<Submission | undefined> {
    return submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
  },

  async listSubmissionsForStudent(studentId: string): Promise<Submission[]> {
    return submissions.filter((s) => s.studentId === studentId);
  },

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    input: SubmitAssignmentInput
  ): Promise<Submission> {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) throw new Error(`Assignment ${assignmentId} was not found.`);

    const isLate = new Date() > new Date(assignment.dueAt);
    const now = new Date().toISOString();
    const existing = submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);

    if (existing) {
      if (existing.submittedAt) {
        existing.previousSubmissions = [
          ...(existing.previousSubmissions ?? []),
          {
            submittedAt: existing.submittedAt,
            fileName: existing.fileName,
            fileType: existing.fileType,
            fileSizeKb: existing.fileSizeKb,
            note: existing.note,
          },
        ];
      }
      existing.status = isLate ? "late" : "submitted";
      existing.fileName = input.fileName;
      existing.fileType = input.fileType;
      existing.fileSizeKb = input.fileSizeKb;
      existing.note = input.note;
      existing.submittedAt = now;
      existing.score = undefined;
      existing.feedback = undefined;
      existing.gradedByStaffId = undefined;
      existing.reviewedAt = undefined;
      return existing;
    }

    const submission: Submission = {
      id: `sub-${submissions.length + 1}`,
      assignmentId,
      studentId,
      status: isLate ? "late" : "submitted",
      fileName: input.fileName,
      fileType: input.fileType,
      fileSizeKb: input.fileSizeKb,
      note: input.note,
      submittedAt: now,
    };
    submissions.push(submission);
    return submission;
  },

  // --- Admin-facing ---

  async listAllAssignments(filters: AssignmentFilters = {}): Promise<Assignment[]> {
    let results = assignments;
    if (filters.moduleId) results = results.filter((a) => a.moduleId === filters.moduleId);
    if (filters.classGroupId) results = results.filter((a) => a.classGroupId === filters.classGroupId);
    if (filters.status) results = results.filter((a) => a.status === filters.status);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((a) => a.title.toLowerCase().includes(query));
    }
    return [...results].sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime());
  },

  async createAssignment(input: CreateAssignmentInput): Promise<Assignment> {
    const assignment: Assignment = { id: `asg-${assignments.length + 1}`, ...input };
    assignments.push(assignment);
    return assignment;
  },

  async updateAssignment(assignmentId: string, updates: UpdateAssignmentInput): Promise<Assignment> {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) throw new Error(`Assignment ${assignmentId} was not found.`);
    Object.assign(assignment, updates);
    return assignment;
  },

  async changeAssignmentStatus(assignmentId: string, status: AssignmentStatus): Promise<Assignment> {
    return assignmentsService.updateAssignment(assignmentId, { status });
  },

  async listSubmissionsForAssignment(assignmentId: string): Promise<Submission[]> {
    return submissions.filter((s) => s.assignmentId === assignmentId);
  },

  async reviewSubmission(
    assignmentId: string,
    studentId: string,
    input: ReviewSubmissionInput
  ): Promise<Submission> {
    const submission = submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
    if (!submission) throw new Error("Submission was not found.");
    if (input.status === "graded" && input.score === undefined) {
      throw new Error("A score is required to mark a submission as graded.");
    }

    submission.status = input.status;
    submission.feedback = input.feedback?.trim() || undefined;
    submission.score = input.status === "graded" ? input.score : undefined;
    submission.gradedByStaffId = input.reviewedByStaffId;
    submission.reviewedAt = new Date().toISOString();
    return submission;
  },
};
