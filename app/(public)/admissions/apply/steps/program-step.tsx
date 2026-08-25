import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { formatDate } from "@/lib/utils";
import type { Intake, Program } from "@/lib/types";
import type { FieldErrors } from "../validation";
import type { WizardFormState } from "../wizard-types";

interface ProgramStepProps {
  programs: Program[];
  intakes: Intake[];
  value: Pick<WizardFormState, "programId" | "intakeId" | "learningMode">;
  onChange: (value: Pick<WizardFormState, "programId" | "intakeId" | "learningMode">) => void;
  errors: FieldErrors;
}

/** The next intake still accepting applications for a program, soonest start date first. */
function findLatestOpenIntake(intakes: Intake[], programId: string): Intake | undefined {
  const eligible = intakes.filter(
    (i) => i.programId === programId && i.applicationsOpen && i.status !== "completed" && i.status !== "cancelled"
  );
  return [...eligible].sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime())[0];
}

export function ProgramStep({ programs, intakes, value, onChange, errors }: ProgramStepProps) {
  const selectedProgram = programs.find((p) => p.id === value.programId);
  const openIntake = selectedProgram ? findLatestOpenIntake(intakes, selectedProgram.id) : undefined;

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="program-select">
          Program <span className="text-destructive">*</span>
        </Label>
        <Select
          value={value.programId || undefined}
          onValueChange={(programId) => {
            const nextProgram = programs.find((p) => p.id === programId);
            const nextMode = nextProgram?.learningModes.length === 1 ? nextProgram.learningModes[0] : undefined;
            const nextIntake = findLatestOpenIntake(intakes, programId);
            onChange({ programId, intakeId: nextIntake?.id ?? "", learningMode: nextMode });
          }}
        >
          <SelectTrigger id="program-select" className="w-full" aria-invalid={Boolean(errors.programId)}>
            <SelectValue placeholder="Select a program">{selectedProgram?.name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.programId && <p className="text-xs text-destructive">{errors.programId}</p>}
      </div>

      {selectedProgram && selectedProgram.learningModes.length > 1 && (
        <div className="space-y-1.5">
          <Label htmlFor="learning-mode-select">Learning Mode</Label>
          <Select
            value={value.learningMode}
            onValueChange={(mode) => onChange({ ...value, learningMode: mode as WizardFormState["learningMode"] })}
          >
            <SelectTrigger id="learning-mode-select" className="w-full">
              <SelectValue placeholder="Select a learning mode">
                {value.learningMode ? LEARNING_MODE_LABELS[value.learningMode] : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {selectedProgram.learningModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {LEARNING_MODE_LABELS[mode]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedProgram && (
        <div className="space-y-1.5">
          <Label>Intake</Label>
          {openIntake ? (
            <p className="text-sm text-muted-foreground">
              This application will be submitted for <span className="font-medium text-foreground">{openIntake.label}</span>
              {openIntake.startDate && <> — starting {formatDate(openIntake.startDate)}</>}. Our admissions team will
              confirm placement after review.
            </p>
          ) : (
            <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <span>
                Applications are currently closed for {selectedProgram.name}. Choose a different program above, or{" "}
                <Link href="/contact" className="font-medium text-primary hover:underline">
                  contact admissions
                </Link>{" "}
                to be notified when the next intake opens.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
