import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { CLASS_STATUS_LABELS, CLASS_STATUS_TONE, LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import type { ClassGroup, Intake, Program, StaffProfile, User } from "@/lib/types";

interface ClassSummaryCardProps {
  classGroup: ClassGroup;
  program?: Program;
  intake?: Intake;
  trainer?: { profile: StaffProfile; user: User };
  enrolledCount: number;
}

export function ClassSummaryCard({ classGroup, program, intake, trainer, enrolledCount }: ClassSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{classGroup.name}</CardTitle>
          <StatusBadge
            status={classGroup.status}
            tone={CLASS_STATUS_TONE[classGroup.status]}
            label={CLASS_STATUS_LABELS[classGroup.status]}
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label="Program" value={program?.name ?? "—"} />
        <Field label="Intake" value={intake?.label ?? "—"} />
        <Field label="Trainer" value={trainer?.user.fullName ?? "—"} />
        <Field
          label="Learning Mode"
          value={program?.learningModes.map((m) => LEARNING_MODE_LABELS[m]).join(", ") ?? "—"}
        />
        <Field label="Enrolled" value={`${enrolledCount} / ${classGroup.capacity} students`} />
        <Field label="Home Room" value={classGroup.homeRoom ?? "—"} />
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
