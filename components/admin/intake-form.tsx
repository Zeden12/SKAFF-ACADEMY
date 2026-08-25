"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_STATUS_LABELS, LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { createIntakeAction, updateIntakeAction } from "@/lib/actions/intake-actions";
import type { ClassSessionMode, Intake, IntakeStatus, Program } from "@/lib/types";

const STATUSES: IntakeStatus[] = ["upcoming", "active", "completed", "cancelled"];
const MODES: ClassSessionMode[] = ["physical", "online", "offsite"];

interface IntakeFormProps {
  programs: Program[];
  initialProgramId?: string;
  initialIntake?: Intake;
}

export function IntakeForm({ programs, initialProgramId, initialIntake }: IntakeFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialIntake);

  const [programId, setProgramId] = useState(initialIntake?.programId ?? initialProgramId ?? "");
  const [label, setLabel] = useState(initialIntake?.label ?? "");
  const [status, setStatus] = useState<IntakeStatus>(initialIntake?.status ?? "upcoming");
  const [applicationsOpen, setApplicationsOpen] = useState(initialIntake?.applicationsOpen ?? false);
  const [applicationOpensAt, setApplicationOpensAt] = useState(initialIntake?.applicationOpensAt?.slice(0, 10) ?? "");
  const [applicationClosesAt, setApplicationClosesAt] = useState(initialIntake?.applicationClosesAt?.slice(0, 10) ?? "");
  const [startDate, setStartDate] = useState(initialIntake?.startDate?.slice(0, 10) ?? "");
  const [endDate, setEndDate] = useState(initialIntake?.endDate?.slice(0, 10) ?? "");
  const [studyModes, setStudyModes] = useState<ClassSessionMode[]>(initialIntake?.studyModes ?? []);
  const [capacity, setCapacity] = useState(initialIntake?.capacity ? String(initialIntake.capacity) : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function toggleMode(mode: ClassSessionMode, checked: boolean) {
    setStudyModes((prev) => (checked ? [...prev, mode] : prev.filter((m) => m !== mode)));
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!programId) nextErrors.programId = "Choose a program.";
    if (!label.trim()) nextErrors.label = "Intake name is required.";
    if (capacity && (!Number.isFinite(Number(capacity)) || Number(capacity) <= 0)) {
      nextErrors.capacity = "Enter a valid capacity.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const payload = {
        programId,
        label: label.trim(),
        status,
        applicationsOpen,
        applicationOpensAt: applicationOpensAt || undefined,
        applicationClosesAt: applicationClosesAt || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        studyModes: studyModes.length > 0 ? studyModes : undefined,
        capacity: capacity ? Number(capacity) : undefined,
      };

      if (isEdit && initialIntake) {
        await updateIntakeAction(initialIntake.id, payload);
        router.push(`/admin/intakes/${initialIntake.id}`);
      } else {
        const { id } = await createIntakeAction(payload);
        router.push(`/admin/intakes/${id}`);
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="intake-program">
            Program <span className="text-destructive">*</span>
          </Label>
          <Select value={programId || undefined} onValueChange={setProgramId} disabled={isEdit}>
            <SelectTrigger id="intake-program" className="w-full" aria-invalid={Boolean(errors.programId)}>
              <SelectValue placeholder="Select a program">{programs.find((p) => p.id === programId)?.name}</SelectValue>
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

        <div className="space-y-1.5">
          <Label htmlFor="intake-label">
            Intake Name <span className="text-destructive">*</span>
          </Label>
          <Input id="intake-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Cohort A" aria-invalid={Boolean(errors.label)} />
          {errors.label && <p className="text-xs text-destructive">{errors.label}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intake-status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as IntakeStatus)}>
            <SelectTrigger id="intake-status" className="w-full">
              <SelectValue>{CLASS_STATUS_LABELS[status]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {CLASS_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intake-capacity">Capacity (optional)</Label>
          <Input
            id="intake-capacity"
            inputMode="numeric"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            aria-invalid={Boolean(errors.capacity)}
          />
          {errors.capacity && <p className="text-xs text-destructive">{errors.capacity}</p>}
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            id="intake-applications-open"
            checked={applicationsOpen}
            onCheckedChange={(checked) => setApplicationsOpen(checked === true)}
          />
          <Label htmlFor="intake-applications-open" className="font-normal">
            Currently accepting applications
          </Label>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intake-app-opens">Applications Open (optional)</Label>
          <Input id="intake-app-opens" type="date" value={applicationOpensAt} onChange={(e) => setApplicationOpensAt(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intake-app-closes">Applications Close (optional)</Label>
          <Input id="intake-app-closes" type="date" value={applicationClosesAt} onChange={(e) => setApplicationClosesAt(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intake-start">Start Date (optional)</Label>
          <Input id="intake-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="intake-end">End Date (optional)</Label>
          <Input id="intake-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Study Modes (optional)</Label>
          <div className="flex flex-wrap gap-4">
            {MODES.map((mode) => (
              <div key={mode} className="flex items-center gap-2">
                <Checkbox
                  id={`intake-mode-${mode}`}
                  checked={studyModes.includes(mode)}
                  onCheckedChange={(checked) => toggleMode(mode, checked === true)}
                />
                <Label htmlFor={`intake-mode-${mode}`} className="font-normal">
                  {LEARNING_MODE_LABELS[mode]}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Save className="size-4" />
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Intake"}
      </Button>
    </div>
  );
}
