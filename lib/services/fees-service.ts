import type { FeeRecord, PaymentTransaction } from "@/lib/types";
import { feeRecords, paymentTransactions } from "@/lib/mock-data/fees";

export interface FeeSummary {
  totalAmount: number;
  totalPaid: number;
  balance: number;
  currency: "RWF" | "USD";
}

/**
 * Fee/payment data access. Mock-backed for now; swap the function bodies for real API calls
 * later without changing any calling UI code. No payment gateway is integrated.
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
};
