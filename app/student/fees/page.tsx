import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentFeesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Fees" description="Your tuition balance and payment history." />
      <EmptyState
        icon={Wallet}
        title="No payment records yet"
        description="Your fees status will appear here once billing is set up."
      />
    </div>
  );
}
