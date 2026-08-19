/** Top-level account family. STAFF covers both teaching and administrative staff. */
export type AccountType = "STUDENT" | "STAFF";

export type StudentStatus =
  | "applicant"
  | "active"
  | "pending_payment"
  | "on_hold"
  | "suspended"
  | "completed"
  | "withdrawn";

export type StaffRole = "teacher" | "admin" | "registrar" | "finance" | "super_admin";

export interface User {
  id: string;
  accountType: AccountType;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentNumber: string;
  status: StudentStatus;
  programId: string;
  intakeId: string;
  classGroupId?: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalId?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  enrolledAt: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  staffNumber: string;
  roles: StaffRole[];
  department?: string;
  title?: string;
  hiredAt: string;
}
