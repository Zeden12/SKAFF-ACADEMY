import { EmptyState } from "@/components/shared/empty-state";
import { StudentAttentionRow } from "@/components/admin/student-summary";
import type { StudentProfile, User } from "@/lib/types";

interface AttentionListProps {
  rows: { user: User; student: StudentProfile; programName?: string }[];
}

export function AttentionList({ rows }: AttentionListProps) {
  if (rows.length === 0) {
    return <EmptyState title="No students currently need attention" />;
  }

  return (
    <div className="space-y-2">
      {rows.map(({ user, student, programName }) => (
        <StudentAttentionRow key={student.id} user={user} student={student} programName={programName} />
      ))}
    </div>
  );
}
