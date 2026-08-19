import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EDUCATION_LEVEL_LABELS } from "@/lib/constants/admissions";
import type { EducationLevel } from "@/lib/types";
import type { FieldErrors } from "../validation";
import type { WizardEducation } from "../wizard-types";

interface EducationStepProps {
  value: WizardEducation;
  onChange: (value: WizardEducation) => void;
  errors: FieldErrors;
}

const EDUCATION_LEVELS = Object.keys(EDUCATION_LEVEL_LABELS) as EducationLevel[];

export function EducationStep({ value, onChange, errors }: EducationStepProps) {
  function set<K extends keyof WizardEducation>(key: K, fieldValue: WizardEducation[K]) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Entry requirements vary by program and academic background — there&rsquo;s no single
        fixed requirement, so answer as best fits your history.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="highestLevel">
            Highest Education Level <span className="text-destructive">*</span>
          </Label>
          <Select value={value.highestLevel || undefined} onValueChange={(level) => set("highestLevel", level as EducationLevel)}>
            <SelectTrigger id="highestLevel" className="w-full" aria-invalid={Boolean(errors.highestLevel)}>
              <SelectValue placeholder="Select a level">
                {value.highestLevel ? EDUCATION_LEVEL_LABELS[value.highestLevel] : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {EDUCATION_LEVEL_LABELS[level]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.highestLevel && <p className="text-xs text-destructive">{errors.highestLevel}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="institution">
            Previous Institution <span className="text-destructive">*</span>
          </Label>
          <Input
            id="institution"
            value={value.institution}
            onChange={(e) => set("institution", e.target.value)}
            aria-invalid={Boolean(errors.institution)}
          />
          {errors.institution && <p className="text-xs text-destructive">{errors.institution}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fieldOfStudy">Field / Subject</Label>
          <Input
            id="fieldOfStudy"
            value={value.fieldOfStudy ?? ""}
            onChange={(e) => set("fieldOfStudy", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="completionYear">Completion Year</Label>
          <Input
            id="completionYear"
            inputMode="numeric"
            value={value.completionYear}
            onChange={(e) => set("completionYear", e.target.value)}
            aria-invalid={Boolean(errors.completionYear)}
          />
          {errors.completionYear && <p className="text-xs text-destructive">{errors.completionYear}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            rows={3}
            value={value.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Anything else relevant to your academic background."
          />
        </div>
      </div>
    </div>
  );
}
