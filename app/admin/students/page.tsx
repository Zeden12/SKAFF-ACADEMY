import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { StudentStatusBadge } from "@/components/shared/student-status-badge";
import { FEE_STATUS_LABELS } from "@/lib/constants/student-portal";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { attendanceService } from "@/lib/services/attendance-service";
import { feesService } from "@/lib/services/fees-service";
import type { StudentProfile, StudentStatus } from "@/lib/types";
import { StudentsFilters } from "./students-filters";

interface StudentRow extends StudentProfile {
  fullName: string;
  programName: string;
  classGroupName: string;
  attendanceRate?: number;
  feeStatusLabel?: string;
}

interface AdminStudentsPageProps {
  searchParams: Promise<{ q?: string; status?: string; program?: string; sort?: string }>;
}

export default async function AdminStudentsPage({ searchParams }: AdminStudentsPageProps) {
  const { q, status, program: programId, sort } = await searchParams;

  const [profiles, programs, classGroups] = await Promise.all([
    studentService.listStudents({
      status: status as StudentStatus | undefined,
      programId,
      query: q,
    }),
    courseService.listPrograms(),
    courseService.listAllClassGroups(),
  ]);

  const rows: StudentRow[] = await Promise.all(
    profiles.map(async (profile) => {
      const [user, program, classGroup, attendanceSummary, feeRecords] = await Promise.all([
        studentService.getUserForStudent(profile.id),
        Promise.resolve(programs.find((p) => p.id === profile.programId)),
        Promise.resolve(classGroups.find((c) => c.id === profile.classGroupId)),
        attendanceService.getAttendanceSummary(profile.id),
        feesService.listFeeRecordsForStudent(profile.id),
      ]);

      return {
        ...profile,
        fullName: user?.fullName ?? "Unknown",
        programName: program?.name ?? "Unknown",
        classGroupName: classGroup?.name ?? "—",
        attendanceRate: attendanceSummary.total > 0 ? attendanceSummary.presentRate : undefined,
        feeStatusLabel: feeRecords[0] ? FEE_STATUS_LABELS[feeRecords[0].status] : undefined,
      };
    })
  );

  const sortedRows = sortStudents(rows, sort);

  const columns: DataTableColumn<StudentRow>[] = [
    { header: "Student Number", accessor: (row) => row.studentNumber },
    { header: "Name", accessor: (row) => row.fullName },
    { header: "Program", accessor: (row) => row.programName },
    { header: "Class", accessor: (row) => row.classGroupName },
    { header: "Status", accessor: (row) => <StudentStatusBadge status={row.status} /> },
    { header: "Fees", accessor: (row) => row.feeStatusLabel ?? "—" },
    { header: "Attendance", accessor: (row) => (row.attendanceRate !== undefined ? `${row.attendanceRate}%` : "—") },
    {
      header: "",
      accessor: (row) => (
        <Link href={`/admin/students/${row.id}`} className="text-sm font-medium text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="View and manage enrolled students." />

      <StudentsFilters programs={programs} />

      <DataTable
        columns={columns}
        data={sortedRows}
        keyExtractor={(row) => row.id}
        emptyTitle="No students match these filters"
        emptyDescription="Try a different search, status, or program."
      />
    </div>
  );
}

function sortStudents(rows: StudentRow[], sort?: string): StudentRow[] {
  const sorted = [...rows];
  if (sort === "student_number") {
    return sorted.sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));
  }
  if (sort === "status") {
    return sorted.sort((a, b) => a.status.localeCompare(b.status));
  }
  return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
}
