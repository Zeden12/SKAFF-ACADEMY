"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEARNING_MODE_LABELS } from "@/lib/constants/programs";
import { createSessionAction, updateSessionAction } from "@/lib/actions/schedule-actions";
import type { ClassGroup, ClassSession, ClassSessionMode, Intake, Module, Program, StaffProfile, User } from "@/lib/types";

const MODES: ClassSessionMode[] = ["physical", "online", "offsite"];

interface SessionFormProps {
  programs: Program[];
  intakes: Intake[];
  classGroups: ClassGroup[];
  modules: Module[];
  staff: { profile: StaffProfile; user: User }[];
  initialClassGroupId?: string;
  initialSession?: ClassSession;
}

function toDateInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function combine(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function SessionForm({
  programs,
  intakes,
  classGroups,
  modules,
  staff,
  initialClassGroupId,
  initialSession,
}: SessionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialSession);

  const intakeToProgram = useMemo(() => new Map(intakes.map((i) => [i.id, i.programId])), [intakes]);
  const classGroupToProgram = useMemo(
    () => new Map(classGroups.map((c) => [c.id, intakeToProgram.get(c.intakeId)])),
    [classGroups, intakeToProgram]
  );

  const [classGroupId, setClassGroupId] = useState(initialSession?.classGroupId ?? initialClassGroupId ?? "");
  const [moduleId, setModuleId] = useState(initialSession?.moduleId ?? "");
  const [staffId, setStaffId] = useState(
    initialSession?.staffId ?? classGroups.find((c) => c.id === (initialSession?.classGroupId ?? initialClassGroupId))?.staffLeadId ?? ""
  );
  const [title, setTitle] = useState(initialSession?.title ?? "");
  const [date, setDate] = useState(toDateInput(initialSession?.startsAt));
  const [startTime, setStartTime] = useState(toTimeInput(initialSession?.startsAt));
  const [endTime, setEndTime] = useState(toTimeInput(initialSession?.endsAt));
  const [mode, setMode] = useState<ClassSessionMode>(initialSession?.mode ?? "physical");
  const [location, setLocation] = useState(initialSession?.location ?? "");
  const [onlineUrl, setOnlineUrl] = useState(initialSession?.onlineUrl ?? "");
  const [notes, setNotes] = useState(initialSession?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const selectedClassProgramId = classGroupToProgram.get(classGroupId);
  const availableModules = modules.filter((m) => m.programId === selectedClassProgramId);

  function handleClassChange(nextClassGroupId: string) {
    setClassGroupId(nextClassGroupId);
    setModuleId("");
    const nextClass = classGroups.find((c) => c.id === nextClassGroupId);
    if (nextClass?.staffLeadId) setStaffId(nextClass.staffLeadId);
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!classGroupId) nextErrors.classGroupId = "Choose a class.";
    if (!moduleId) nextErrors.moduleId = "Choose a module.";
    if (!staffId) nextErrors.staffId = "Choose a trainer.";
    if (!title.trim()) nextErrors.title = "Session title is required.";
    if (!date) nextErrors.date = "Date is required.";
    if (!startTime) nextErrors.startTime = "Start time is required.";
    if (!endTime) nextErrors.endTime = "End time is required.";
    if (date && startTime && endTime && combine(date, endTime) <= combine(date, startTime)) {
      nextErrors.endTime = "End time must be after the start time.";
    }
    if (mode === "online" && !onlineUrl.trim()) nextErrors.onlineUrl = "An online meeting link is required.";
    if (mode !== "online" && !location.trim()) nextErrors.location = "A location is required for this mode.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      try {
        const payload = {
          classGroupId,
          moduleId,
          staffId,
          title: title.trim(),
          startsAt: combine(date, startTime),
          endsAt: combine(date, endTime),
          mode,
          location: mode !== "online" ? location.trim() : undefined,
          onlineUrl: mode === "online" ? onlineUrl.trim() : undefined,
          notes: notes.trim() || undefined,
        };

        if (isEdit && initialSession) {
          await updateSessionAction(initialSession.id, payload);
          router.push(`/admin/schedule/${initialSession.id}`);
        } else {
          const { id } = await createSessionAction(payload);
          router.push(`/admin/schedule/${id}`);
        }
        router.refresh();
      } catch (err) {
        setErrors({ form: err instanceof Error ? err.message : "Could not save this session." });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="session-class">
            Class <span className="text-destructive">*</span>
          </Label>
          <Select value={classGroupId || undefined} onValueChange={handleClassChange}>
            <SelectTrigger id="session-class" className="w-full" aria-invalid={Boolean(errors.classGroupId)}>
              <SelectValue placeholder="Select a class">
                {classGroups.find((c) => c.id === classGroupId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {classGroups.map((classGroup) => {
                const programName = programs.find((p) => p.id === classGroupToProgram.get(classGroup.id))?.name;
                return (
                  <SelectItem key={classGroup.id} value={classGroup.id}>
                    {classGroup.name} — {programName ?? "—"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.classGroupId && <p className="text-xs text-destructive">{errors.classGroupId}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-module">
            Module <span className="text-destructive">*</span>
          </Label>
          <Select value={moduleId || undefined} onValueChange={setModuleId} disabled={!classGroupId}>
            <SelectTrigger id="session-module" className="w-full" aria-invalid={Boolean(errors.moduleId)}>
              <SelectValue placeholder="Select a module">
                {availableModules.find((m) => m.id === moduleId)?.title}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableModules.map((mod) => (
                <SelectItem key={mod.id} value={mod.id}>
                  {mod.code} — {mod.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.moduleId && <p className="text-xs text-destructive">{errors.moduleId}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="session-title">
            Session Title <span className="text-destructive">*</span>
          </Label>
          <Input id="session-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errors.title)} />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-trainer">
            Trainer <span className="text-destructive">*</span>
          </Label>
          <Select value={staffId || undefined} onValueChange={setStaffId}>
            <SelectTrigger id="session-trainer" className="w-full" aria-invalid={Boolean(errors.staffId)}>
              <SelectValue placeholder="Select a trainer">
                {staff.find((s) => s.profile.id === staffId)?.user.fullName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {staff.map((s) => (
                <SelectItem key={s.profile.id} value={s.profile.id}>
                  {s.user.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.staffId && <p className="text-xs text-destructive">{errors.staffId}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-mode">Mode</Label>
          <Select value={mode} onValueChange={(value) => setMode(value as ClassSessionMode)}>
            <SelectTrigger id="session-mode" className="w-full">
              <SelectValue>{LEARNING_MODE_LABELS[mode]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MODES.map((m) => (
                <SelectItem key={m} value={m}>
                  {LEARNING_MODE_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-date">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input id="session-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={Boolean(errors.date)} />
          {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-start">
            Start Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="session-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            aria-invalid={Boolean(errors.startTime)}
          />
          {errors.startTime && <p className="text-xs text-destructive">{errors.startTime}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-end">
            End Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="session-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            aria-invalid={Boolean(errors.endTime)}
          />
          {errors.endTime && <p className="text-xs text-destructive">{errors.endTime}</p>}
        </div>

        {mode === "online" ? (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="session-online-url">
              Online Meeting Link <span className="text-destructive">*</span>
            </Label>
            <Input
              id="session-online-url"
              value={onlineUrl}
              onChange={(e) => setOnlineUrl(e.target.value)}
              placeholder="https://meet.google.com/..."
              aria-invalid={Boolean(errors.onlineUrl)}
            />
            {errors.onlineUrl && <p className="text-xs text-destructive">{errors.onlineUrl}</p>}
          </div>
        ) : (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="session-location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="session-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. SKAFF ACADEMY Campus — Lab 3"
              aria-invalid={Boolean(errors.location)}
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
          </div>
        )}

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="session-notes">Notes (optional)</Label>
          <Textarea id="session-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      {errors.form && <p className="text-xs text-destructive">{errors.form}</p>}

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Save className="size-4" />
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Session"}
      </Button>
    </div>
  );
}
