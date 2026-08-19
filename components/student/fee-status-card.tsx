import { StatusBadge } from "@/components/shared/status-badge";
import { ProgressSummary } from "@/components/student/progress-summary";
import { FEE_STATUS_LABELS, FEE_STATUS_TONE } from "@/lib/constants/student-portal";
import type { FeeRecord } from "@/lib/types";

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

interface FeeStatusCardProps {
  feeRecord: FeeRecord;
  compact?: boolean;
}

export function FeeStatusCard({ feeRecord, compact = false }: FeeStatusCardProps) {
  const balance = feeRecord.totalAmount - feeRecord.amountPaid;
  const percentagePaid = feeRecord.totalAmount > 0 ? (feeRecord.amountPaid / feeRecord.totalAmount) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {!compact && <p className="text-sm font-medium text-foreground">{feeRecord.description}</p>}
        <StatusBadge
          status={feeRecord.status}
          tone={FEE_STATUS_TONE[feeRecord.status]}
          label={FEE_STATUS_LABELS[feeRecord.status]}
        />
      </div>
      <ProgressSummary
        label="Amount Paid"
        valueLabel={`${formatCurrency(feeRecord.amountPaid, feeRecord.currency)} / ${formatCurrency(feeRecord.totalAmount, feeRecord.currency)}`}
        percentage={percentagePaid}
        tone={feeRecord.status === "overdue" ? "destructive" : feeRecord.status === "partially_paid" ? "warning" : "default"}
      />
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Balance</span>
        <span className="font-semibold text-foreground">{formatCurrency(balance, feeRecord.currency)}</span>
      </div>
      {feeRecord.dueDate && !compact && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Next Due Date</span>
          <span>{new Date(feeRecord.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
