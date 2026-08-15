import { PageHeader } from "@/components/shared/page-header";
import { FilterBar } from "@/components/shared/filter-bar";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import type { StudentProfile } from "@/lib/types";

interface StudentRow extends StudentProfile {
  fullName: string;
  programName: string;
}

export default async function AdminStudentsPage() {
  const [profiles, programs] = await Promise.all([
    studentService.listStudents(),
    courseService.listPrograms(),
  ]);

  const rows: StudentRow[] = await Promise.all(
    profiles.map(async (profile) => {
      const user = await studentService.getUserForStudent(profile.id);
      const program = programs.find((p) => p.id === profile.programId);
      return {
        ...profile,
        fullName: user?.fullName ?? "Unknown",
        programName: program?.name ?? "Unknown",
      };
    })
  );

  const columns: DataTableColumn<StudentRow>[] = [
    { header: "Student", accessor: (row) => row.fullName },
    { header: "Student Number", accessor: (row) => row.studentNumber },
    { header: "Program", accessor: (row) => row.programName },
    { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="View and manage enrolled students."
        actions={<Button disabled>Add Student</Button>}
      />

      <FilterBar>
        <SearchInput placeholder="Search students..." containerClassName="sm:w-72" />
        <Select>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <DataTable columns={columns} data={rows} keyExtractor={(row) => row.id} />
    </div>
  );
}
