import type { FeeRecord, PaymentTransaction } from "@/lib/types";
import { relativeDay } from "./date-helpers";

/**
 * Demo/mock billing records tied to this student's account only — not published program
 * pricing. Real fee schedules are not part of this frontend-first phase.
 */
export const feeRecords: FeeRecord[] = [
  {
    id: "fee-1",
    studentId: "student-1",
    intakeId: "intake-1",
    description: "Tuition — Full-Stack Software Development (Cohort A)",
    totalAmount: 450000,
    amountPaid: 250000,
    currency: "RWF",
    status: "partially_paid",
    dueDate: relativeDay(10),
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
];
