import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ApplicantPersonalInformation } from "@/lib/types";
import type { FieldErrors } from "../validation";

interface PersonalStepProps {
  value: ApplicantPersonalInformation;
  onChange: (value: ApplicantPersonalInformation) => void;
  errors: FieldErrors;
}

export function PersonalStep({ value, onChange, errors }: PersonalStepProps) {
  function set<K extends keyof ApplicantPersonalInformation>(key: K, fieldValue: string) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full Name" id="fullName" required error={errors.fullName}>
        <Input
          id="fullName"
          value={value.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          aria-invalid={Boolean(errors.fullName)}
        />
      </Field>

      <Field label="Email" id="email" required error={errors.email}>
        <Input
          id="email"
          type="email"
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>

      <Field label="Phone" id="phone" required error={errors.phone}>
        <Input
          id="phone"
          type="tel"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
          aria-invalid={Boolean(errors.phone)}
        />
      </Field>

      <Field label="Date of Birth" id="dateOfBirth" required error={errors.dateOfBirth}>
        <Input
          id="dateOfBirth"
          type="date"
          value={value.dateOfBirth}
          onChange={(e) => set("dateOfBirth", e.target.value)}
          aria-invalid={Boolean(errors.dateOfBirth)}
        />
      </Field>

      <Field label="Nationality" id="nationality" required error={errors.nationality}>
        <Input
          id="nationality"
          value={value.nationality}
          onChange={(e) => set("nationality", e.target.value)}
          aria-invalid={Boolean(errors.nationality)}
        />
      </Field>

      <Field label="Current Address" id="address" required error={errors.address} className="sm:col-span-2">
        <Input
          id="address"
          value={value.address}
          onChange={(e) => set("address", e.target.value)}
          aria-invalid={Boolean(errors.address)}
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  error,
  className,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
