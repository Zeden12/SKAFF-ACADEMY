import type { StudentProfile, User } from "@/lib/types";
import { studentProfiles, studentUsers } from "@/lib/mock-data/students";

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
};
