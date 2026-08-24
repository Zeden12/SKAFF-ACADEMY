import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { FeeRowActions } from "@/components/admin/fee-row-actions";
import { FEE_STATUS_LABELS, FEE_STATUS_TONE } from "@/lib/constants/student-portal";
import { studentService } from "@/lib/services/student-service";
import { feesService } from "@/lib/services/fees-service";
import type { FeeRecord, FeeStatus } from "@/lib/types";
import { FeesFilters } from "./fees-filters";

interface FeeRow extends FeeRecord {
  studentNumber: string;
  studentName: string;
}

interface AdminFeesPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminFeesPage({ searchParams }: AdminFeesPageProps) {
  const { q, status } = await searchParams;

  const feeRecords = await feesService.listAllFeeRecords({ status: status as FeeStatus | undefined });

  let rows: FeeRow[] = await Promise.all(
    feeRecords.map(async (fee) => {
      const student = await studentService.getStudentProfile(fee.studentId);
      const user = await studentService.getUserForStudent(fee.studentId);
      return {
        ...fee,
        studentNumber: student?.studentNumber ?? "—",
        studentName: user?.fullName ?? "—",
      };
    })
  );

  if (q) {
    const query = q.toLowerCase();
    rows = rows.filter(
      (row) => row.studentName.toLowerCase().includes(query) || row.studentNumber.toLowerCase().includes(query)
    );
  }

  const columns: DataTableColumn<FeeRow>[] = [
    { header: "Student Number", accessor: (row) => row.studentNumber },
    { header: "Student", accessor: (row) => row.studentName },
    { header: "Description", accessor: (row) => row.description },
    {
      header: "Balance",
      accessor: (row) => `${row.currency} ${(row.totalAmount - row.amountPaid).toLocaleString()}`,
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} tone={FEE_STATUS_TONE[row.status]} label={FEE_STATUS_LABELS[row.status]} />,
    },
    {
      header: "",
      accessor: (row) => (
        <div className="flex flex-wrap items-center gap-3">
          <FeeRowActions
            feeRecordId={row.id}
            studentName={row.studentName}
            balance={row.totalAmount - row.amountPaid}
            currency={row.currency}
          />
          <Link href={`/admin/students/${row.studentId}`} className="text-sm font-medium text-primary hover:underline">
            View Student
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Fees" description="Search students and record payments against their fee balances." />

      <FeesFilters />

      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.id} emptyTitle="No fee records match these filters" />
    </div>
  );
}
