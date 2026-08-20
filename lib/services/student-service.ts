import type { StudentProfile, StudentStatus, StudentStatusHistoryEntry, User } from "@/lib/types";
import { studentProfiles, studentUsers } from "@/lib/mock-data/students";
import { studentStatusHistory } from "@/lib/mock-data/student-status-history";

/**
 * The signed-in student for this frontend-first phase, since there is no real authentication
 * yet. Swap this for a real session lookup once auth exists — every page reads "the current
 * student" through this function rather than assuming array position.
 */
const CURRENT_STUDENT_ID = "student-1";

/** Placeholder actor until real staff accounts exist. */
export const ADMIN_STATUS_ACTOR = "Academic Office";

/** Status changes into these states must include a student-facing explanation. */
const STATUSES_REQUIRING_MESSAGE: StudentStatus[] = ["on_hold", "suspended", "withdrawn"];

export interface StudentFilters {
  status?: StudentStatus;
  programId?: string;
  classGroupId?: string;
  query?: string;
}

export interface UpdateStudentStatusInput {
  actorName: string;
  publicMessage?: string;
  internalNote?: string;
}

/**
 * Student data access. Mock-backed for now (in-memory arrays act as a stand-in database);
 * swap the function bodies for real API calls later without changing any calling UI code.
 * The admin portal and student portal both read/write through this same module, so a status
 * change made here is immediately reflected everywhere else that reads student data.
 */
export const studentService = {
  async listStudents(filters: StudentFilters = {}): Promise<StudentProfile[]> {
    let results = studentProfiles;
    if (filters.status) results = results.filter((s) => s.status === filters.status);
    if (filters.programId) results = results.filter((s) => s.programId === filters.programId);
    if (filters.classGroupId) results = results.filter((s) => s.classGroupId === filters.classGroupId);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchingUserIds = new Set(
        studentUsers.filter((u) => u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)).map((u) => u.id)
      );
      results = results.filter(
        (s) => s.studentNumber.toLowerCase().includes(query) || matchingUserIds.has(s.userId)
      );
    }
    return results;
  },

  async listStudentsForClassGroup(classGroupId: string): Promise<StudentProfile[]> {
    return studentProfiles.filter((s) => s.classGroupId === classGroupId);
  },

  async getStudentProfile(studentId: string): Promise<StudentProfile | undefined> {
    return studentProfiles.find((s) => s.id === studentId);
  },

  async getUserForStudent(studentId: string): Promise<User | undefined> {
    const profile = studentProfiles.find((s) => s.id === studentId);
    if (!profile) return undefined;
    return studentUsers.find((u) => u.id === profile.userId);
  },

  async getCurrentStudent(): Promise<{ profile: StudentProfile; user: User } | undefined> {
    const profile = studentProfiles.find((s) => s.id === CURRENT_STUDENT_ID);
    if (!profile) return undefined;
    const user = studentUsers.find((u) => u.id === profile.userId);
    if (!user) return undefined;
    return { profile, user };
  },

  async updateCurrentStudentContact(
    updates: Partial<Pick<StudentProfile, "address" | "emergencyContactName" | "emergencyContactPhone">> &
      Partial<Pick<User, "phone">>
  ): Promise<void> {
    const profile = studentProfiles.find((s) => s.id === CURRENT_STUDENT_ID);
    if (!profile) return;
    if (updates.address !== undefined) profile.address = updates.address;
    if (updates.emergencyContactName !== undefined) profile.emergencyContactName = updates.emergencyContactName;
    if (updates.emergencyContactPhone !== undefined) profile.emergencyContactPhone = updates.emergencyContactPhone;

    if (updates.phone !== undefined) {
      const user = studentUsers.find((u) => u.id === profile.userId);
      if (user) user.phone = updates.phone;
    }
  },

  /** Whether a given status change requires a student-facing explanation. */
  statusRequiresMessage(status: StudentStatus): boolean {
    return STATUSES_REQUIRING_MESSAGE.includes(status);
  },

  async updateStudentStatus(
    studentId: string,
    newStatus: StudentStatus,
    input: UpdateStudentStatusInput
  ): Promise<StudentProfile> {
    const profile = studentProfiles.find((s) => s.id === studentId);
    if (!profile) throw new Error(`Student ${studentId} was not found.`);

    const publicMessage = input.publicMessage?.trim() || undefined;
    if (STATUSES_REQUIRING_MESSAGE.includes(newStatus) && !publicMessage) {
      throw new Error("A student-facing message is required for this status change.");
    }

    const previousStatus = profile.status;
    const internalNote = input.internalNote?.trim() || undefined;

    profile.status = newStatus;
    profile.statusMessage = publicMessage;
    profile.internalNotes = internalNote;

    studentStatusHistory.push({
      id: `sh-${studentStatusHistory.length + 1}`,
      studentId,
      timestamp: new Date().toISOString(),
      actor: "admin_staff",
      actorName: input.actorName,
      previousStatus,
      newStatus,
      publicMessage,
      internalNote,
    });

    return profile;
  },

  async getStatusHistory(studentId: string): Promise<StudentStatusHistoryEntry[]> {
    return [...studentStatusHistory.filter((h) => h.studentId === studentId)].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
};
