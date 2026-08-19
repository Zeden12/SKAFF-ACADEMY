import type { AttendanceRecord } from "@/lib/types";
import { relativeDay } from "./date-helpers";

/** One record per past class-1 session, for student-1. */
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "att-1",
    classSessionId: "session-1",
    studentId: "student-1",
    status: "present",
    recordedByStaffId: "staff-1",
    recordedAt: relativeDay(-21, 12),
  },
  {
    id: "att-2",
    classSessionId: "session-2",
    studentId: "student-1",
    status: "present",
    recordedByStaffId: "staff-1",
    recordedAt: relativeDay(-18, 12),
  },
  {
    id: "att-3",
    classSessionId: "session-3",
    studentId: "student-1",
    status: "absent",
    recordedByStaffId: "staff-1",
    recordedAt: relativeDay(-14, 12),
    note: "No message received from student.",
  },
  {
    id: "att-4",
    classSessionId: "session-4",
    studentId: "student-1",
    status: "late",
    recordedByStaffId: "staff-1",
    recordedAt: relativeDay(-10, 12),
    note: "Arrived 20 minutes late.",
  },
  {
    id: "att-5",
    classSessionId: "session-5",
    studentId: "student-1",
    status: "present",
    recordedByStaffId: "staff-1",
    recordedAt: relativeDay(-6, 19),
  },
  {
    id: "att-6",
    classSessionId: "session-6",
    studentId: "student-1",
    status: "present",
    recordedByStaffId: "staff-1",
    recordedAt: relativeDay(-2, 12),
  },
];
