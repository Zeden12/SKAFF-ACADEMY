import type { StudentProfile, User } from "@/lib/types";
import { studentProfiles, studentUsers } from "@/lib/mock-data/students";

/**
 * The signed-in student for this frontend-first phase, since there is no real authentication
 * yet. Swap this for a real session lookup once auth exists — every page reads "the current
 * student" through this function rather than assuming array position.
 */
const CURRENT_STUDENT_ID = "student-1";

/**
 * Student data access. Mock-backed for now; swap the function bodies
 * for real API calls later without changing any calling UI code.
 */
export const studentService = {
  async listStudents(): Promise<StudentProfile[]> {
    return studentProfiles;
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
};
