import type { User, StaffProfile } from "@/lib/types";

export const staffUsers: User[] = [
  {
    id: "staff-user-1",
    accountType: "STAFF",
    fullName: "Eric Mugisha",
    email: "eric.mugisha@skaffacademy.rw",
    phone: "+250 788 100 200",
    createdAt: "2025-08-01",
    updatedAt: "2025-08-01",
  },
];

export const staffProfiles: StaffProfile[] = [
  {
    id: "staff-1",
    userId: "staff-user-1",
    staffNumber: "SKF-STAFF-0001",
    roles: ["teacher"],
    department: "Technology",
    title: "Full-Stack Development Trainer",
    hiredAt: "2025-08-01",
  },
];
