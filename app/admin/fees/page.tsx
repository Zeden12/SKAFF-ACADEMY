import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminFeesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Fees" description="Track student payments and outstanding balances." />
      <EmptyState
        icon={Wallet}
        title="No payment records yet"
        description="Student payment records will appear here."
      />
    </div>
  );
}
