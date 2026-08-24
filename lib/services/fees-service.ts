import type { FeeRecord, FeeStatus, PaymentMethod, PaymentTransaction } from "@/lib/types";
import { feeRecords, paymentTransactions } from "@/lib/mock-data/fees";

export interface FeeSummary {
  totalAmount: number;
  totalPaid: number;
  balance: number;
  currency: "RWF" | "USD";
}

export interface FeeFilters {
  query?: string;
  status?: FeeStatus;
}

export interface RecordPaymentInput {
  feeRecordId: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  note?: string;
  recordedByStaffId: string;
}

/** A fee is overdue once its due date has passed with a balance still owed. */
export function deriveFeeStatus(record: Pick<FeeRecord, "totalAmount" | "amountPaid" | "dueDate">): FeeStatus {
  if (record.amountPaid >= record.totalAmount) return "paid";
  if (record.dueDate && new Date(record.dueDate).getTime() < Date.now()) return "overdue";
  if (record.amountPaid > 0) return "partially_paid";
  return "pending";
}

/**
 * Fee/payment data access. Mock-backed for now; swap the function bodies for real API calls
 * later without changing any calling UI code. No payment gateway is integrated — payments are
 * recorded metadata only. Admin and student portals read/write through this same module.
 */
export const feesService = {
  async listFeeRecordsForStudent(studentId: string): Promise<FeeRecord[]> {
    return feeRecords.filter((f) => f.studentId === studentId);
  },

  async listPaymentsForStudent(studentId: string): Promise<PaymentTransaction[]> {
    return [...paymentTransactions.filter((p) => p.studentId === studentId)].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );
  },

  async getFeeSummary(studentId: string): Promise<FeeSummary | undefined> {
    const records = await feesService.listFeeRecordsForStudent(studentId);
    if (records.length === 0) return undefined;
    const totalAmount = records.reduce((sum, r) => sum + r.totalAmount, 0);
    const totalPaid = records.reduce((sum, r) => sum + r.amountPaid, 0);
    return { totalAmount, totalPaid, balance: totalAmount - totalPaid, currency: records[0].currency };
  },

  // --- Admin-facing ---

  async listAllFeeRecords(filters: FeeFilters = {}): Promise<FeeRecord[]> {
    let rows = feeRecords;
    if (filters.status) rows = rows.filter((f) => f.status === filters.status);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      rows = rows.filter((f) => f.description.toLowerCase().includes(query));
    }
    return rows;
  },

  async getFeeRecord(feeRecordId: string): Promise<FeeRecord | undefined> {
    return feeRecords.find((f) => f.id === feeRecordId);
  },

  async listPaymentsForFeeRecord(feeRecordId: string): Promise<PaymentTransaction[]> {
    return [...paymentTransactions.filter((p) => p.feeRecordId === feeRecordId)].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );
  },

  async recordPayment(input: RecordPaymentInput): Promise<PaymentTransaction> {
    if (input.amount <= 0) throw new Error("Payment amount must be greater than 0.");
    if (!input.reference.trim()) throw new Error("A payment reference is required.");

    const feeRecord = feeRecords.find((f) => f.id === input.feeRecordId);
    if (!feeRecord) throw new Error(`Fee record ${input.feeRecordId} was not found.`);

    const duplicateReference = paymentTransactions.some(
      (p) => p.feeRecordId === input.feeRecordId && p.reference.trim().toLowerCase() === input.reference.trim().toLowerCase()
    );
    if (duplicateReference) throw new Error("A payment with this reference has already been recorded.");

    const balance = feeRecord.totalAmount - feeRecord.amountPaid;
    if (input.amount > balance) {
      throw new Error(`Payment of ${input.amount} exceeds the outstanding balance of ${balance}.`);
    }

    const payment: PaymentTransaction = {
      id: `pay-${paymentTransactions.length + 1}`,
      feeRecordId: input.feeRecordId,
      studentId: feeRecord.studentId,
      amount: input.amount,
      currency: feeRecord.currency,
      method: input.method,
      reference: input.reference.trim(),
      paidAt: new Date().toISOString(),
      note: input.note?.trim() || undefined,
      recordedByStaffId: input.recordedByStaffId,
    };
    paymentTransactions.push(payment);

    feeRecord.amountPaid += input.amount;
    feeRecord.status = deriveFeeStatus(feeRecord);

    return payment;
  },
};
