import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Program, ClassGroup, Intake, StudentProfile } from "@/lib/types";

interface StudentOverviewCardProps {
  student: StudentProfile;
  program?: Program;
  intake?: Intake;
  classGroup?: ClassGroup;
}

export function StudentOverviewCard({ student, program, intake, classGroup }: StudentOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Enrollment</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label="Program" value={program?.name ?? "—"} />
        <Field label="Status" value={<StatusBadge status={student.status} />} />
        <Field label="Intake / Class" value={`${intake?.label ?? "—"}${classGroup ? ` · ${classGroup.name}` : ""}`} />
        <Field label="Student Number" value={student.studentNumber} />
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
