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
  assessmentName: string;
  score: number;
  maxScore: number;
  grade: ResultGrade;
  feedback?: string;
  publishedAt?: string;
}

export type FeeStatus = "paid" | "partially_paid" | "pending" | "overdue";

/** A billable item on a student's account (e.g. one term's tuition). */
export interface FeeRecord {
  id: string;
  studentId: string;
  intakeId: string;
  description: string;
  totalAmount: number;
  amountPaid: number;
  currency: "RWF" | "USD";
  status: FeeStatus;
  dueDate?: string;
}

export type PaymentMethod = "cash" | "mobile_money" | "bank_transfer" | "card";

/** A single payment/receipt applied against a FeeRecord. */
export interface PaymentTransaction {
  id: string;
  feeRecordId: string;
  studentId: string;
  amount: number;
  currency: "RWF" | "USD";
  method: PaymentMethod;
  reference: string;
  paidAt: string;
}
