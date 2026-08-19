import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FeeStatusCard } from "@/components/student/fee-status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { feesService } from "@/lib/services/fees-service";
import { formatDate } from "@/lib/utils";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  mobile_money: "Mobile Money",
  bank_transfer: "Bank Transfer",
  card: "Card",
};

export default async function StudentFeesPage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Fees" description="No student account found." />;
  }

  const [feeRecords, payments] = await Promise.all([
    feesService.listFeeRecordsForStudent(current.profile.id),
    feesService.listPaymentsForStudent(current.profile.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Fees" description="Your tuition balance and payment history." />

      {feeRecords.length === 0 ? (
        <EmptyState title="No payment records yet" description="Your fees status will appear here once billing is set up." />
      ) : (
        <div className="space-y-4">
          {feeRecords.map((fee) => (
            <Card key={fee.id}>
              <CardHeader>
                <CardTitle className="text-base">{fee.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <FeeStatusCard feeRecord={fee} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-foreground">Payment History</h2>
        {payments.length === 0 ? (
          <EmptyState title="No payments recorded yet" className="mt-3" />
        ) : (
          <div className="mt-3 space-y-2">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {METHOD_LABELS[payment.method]} · {formatDate(payment.paidAt)}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{payment.reference}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
