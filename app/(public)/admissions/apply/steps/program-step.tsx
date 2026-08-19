import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import type { Intake, Program } from "@/lib/types";
import type { FieldErrors } from "../validation";
import type { WizardFormState } from "../wizard-types";

interface ProgramStepProps {
  programs: Program[];
  intakes: Intake[];
  value: Pick<WizardFormState, "programId" | "learningMode">;
  onChange: (value: Pick<WizardFormState, "programId" | "learningMode">) => void;
  errors: FieldErrors;
}

export function ProgramStep({ programs, intakes, value, onChange, errors }: ProgramStepProps) {
  const selectedProgram = programs.find((p) => p.id === value.programId);
  const programIntakes = selectedProgram ? intakes.filter((i) => i.programId === selectedProgram.id) : [];

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
            onChange({ programId, learningMode: nextMode });
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
          <Label>Preferred Intake</Label>
          {programIntakes.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              This program currently has an open intake: {programIntakes.map((i) => i.label).join(", ")}.
              Our admissions team will confirm placement after review.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No specific intake is currently published for this program. Our admissions team
              will confirm your start date after reviewing your application.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
