export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  classSessionId: string;
  studentId: string;
  status: AttendanceStatus;
  recordedByStaffId: string;
  recordedAt: string;
  note?: string;
}

export type ResultGrade = "A" | "B" | "C" | "D" | "E" | "F" | "incomplete";

export interface Result {
  id: string;
  studentId: string;
  moduleId: string;
  intakeId: string;
  score: number;
  grade: ResultGrade;
  publishedAt?: string;
}

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "card";
export type PaymentStatus = "pending" | "paid" | "partial" | "overdue" | "refunded";

export interface PaymentRecord {
  id: string;
  studentId: string;
  intakeId: string;
  description: string;
  amountDue: number;
  amountPaid: number;
  currency: "RWF" | "USD";
  status: PaymentStatus;
  method?: PaymentMethod;
  dueDate: string;
  paidAt?: string;
}
