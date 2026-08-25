import type { FeeRecord, PaymentTransaction } from "@/lib/types";
import { relativeDay } from "./date-helpers";

/**
 * Demo/mock billing records tied to this student's account only — not published program
 * pricing. Real fee schedules are not part of this frontend-first phase.
 */
export const feeRecords: FeeRecord[] = [
  {
    id: "fee-1",
    enrollmentId: "enr-1",
    studentId: "student-1",
    intakeId: "intake-1",
    description: "Tuition — Full-Stack Development (Cohort A)",
    totalAmount: 450000,
    amountPaid: 250000,
    currency: "RWF",
    status: "partially_paid",
    dueDate: relativeDay(10),
  },
  {
    id: "fee-2",
    enrollmentId: "enr-2",
    studentId: "student-2",
    intakeId: "intake-2",
    description: "Tuition — UI/UX Design (Cohort B)",
    totalAmount: 400000,
    amountPaid: 0,
    currency: "RWF",
    status: "pending",
    dueDate: relativeDay(5),
  },
  {
    id: "fee-3",
    enrollmentId: "enr-3",
    studentId: "student-3",
    intakeId: "intake-1",
    description: "Tuition — Full-Stack Development (Cohort A)",
    totalAmount: 450000,
    amountPaid: 100000,
    currency: "RWF",
    status: "overdue",
    dueDate: relativeDay(-14),
  },
  {
    id: "fee-4",
    enrollmentId: "enr-4",
    studentId: "student-4",
    intakeId: "intake-1",
    description: "Tuition — Full-Stack Development (Cohort A)",
    totalAmount: 450000,
    amountPaid: 450000,
    currency: "RWF",
    status: "paid",
    dueDate: relativeDay(-30),
  },
];

export const paymentTransactions: PaymentTransaction[] = [
  {
    id: "pay-1",
    feeRecordId: "fee-1",
    studentId: "student-1",
    amount: 100000,
    currency: "RWF",
    method: "mobile_money",
    reference: "MM-2026-88213",
    paidAt: relativeDay(-52),
  },
  {
    id: "pay-2",
    feeRecordId: "fee-1",
    studentId: "student-1",
    amount: 150000,
    currency: "RWF",
    method: "bank_transfer",
    reference: "BT-2026-44092",
    paidAt: relativeDay(-20),
  },
  {
    id: "pay-3",
    feeRecordId: "fee-3",
    studentId: "student-3",
    amount: 100000,
    currency: "RWF",
    method: "cash",
    reference: "CSH-2026-10093",
    paidAt: relativeDay(-45),
  },
  {
    id: "pay-4",
    feeRecordId: "fee-4",
    studentId: "student-4",
    amount: 450000,
    currency: "RWF",
    method: "bank_transfer",
    reference: "BT-2026-30021",
    paidAt: relativeDay(-31),
  },
];
