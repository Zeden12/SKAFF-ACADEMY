import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StudentStatusBadge } from "@/components/shared/student-status-badge";
import type { StudentProfile, User } from "@/lib/types";

export interface ClassRosterRow {
  student: StudentProfile;
  user: User;
  attendanceRate?: number;
}

interface ClassRosterTableProps {
  rows: ClassRosterRow[];
}

export function ClassRosterTable({ rows }: ClassRosterTableProps) {
  const columns: DataTableColumn<ClassRosterRow>[] = [
    { header: "Student Number", accessor: (row) => row.student.studentNumber },
    { header: "Name", accessor: (row) => row.user.fullName },
    { header: "Status", accessor: (row) => <StudentStatusBadge status={row.student.status} /> },
    {
      header: "Attendance",
      accessor: (row) => (row.attendanceRate !== undefined ? `${row.attendanceRate}%` : "—"),
    },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/students/${row.student.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      keyExtractor={(row) => row.student.id}
      emptyTitle="No students enrolled in this class yet"
    />
  );
}
