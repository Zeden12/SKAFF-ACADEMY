import type { Assignment, Submission } from "@/lib/types";
import { assignments, submissions } from "@/lib/mock-data/assignments";

export interface SubmitAssignmentInput {
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  note?: string;
}

/**
 * Assignment and submission data access. Mock-backed for now; submissions mutate an in-memory
 * array as a stand-in database for this frontend-first phase — a real backend can later own
 * persistence without changing calling UI code.
 */
export const assignmentsService = {
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
      existing.status = isLate ? "late" : "submitted";
      existing.fileName = input.fileName;
      existing.fileType = input.fileType;
      existing.fileSizeKb = input.fileSizeKb;
      existing.note = input.note;
      existing.submittedAt = now;
      existing.score = undefined;
      existing.feedback = undefined;
      existing.gradedByStaffId = undefined;
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
};
