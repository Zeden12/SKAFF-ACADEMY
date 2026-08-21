"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAssignmentAction, updateAssignmentAction } from "@/lib/actions/academic-actions";
import type { Assignment, AssignmentStatus, ClassGroup, Intake, Module, Program } from "@/lib/types";

interface AssignmentFormProps {
  programs: Program[];
  intakes: Intake[];
  classGroups: ClassGroup[];
  modules: Module[];
  initialAssignment?: Assignment;
}

function toDateTimeLocal(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function AssignmentForm({ programs, intakes, classGroups, modules, initialAssignment }: AssignmentFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialAssignment);

  const intakeToProgram = useMemo(() => new Map(intakes.map((i) => [i.id, i.programId])), [intakes]);
  const classGroupToProgram = useMemo(
    () => new Map(classGroups.map((c) => [c.id, intakeToProgram.get(c.intakeId)])),
    [classGroups, intakeToProgram]
  );
  const initialProgramId = initialAssignment ? classGroupToProgram.get(initialAssignment.classGroupId) : undefined;

  const [programId, setProgramId] = useState(initialProgramId ?? "");
  const [classGroupId, setClassGroupId] = useState(initialAssignment?.classGroupId ?? "");
  const [moduleId, setModuleId] = useState(initialAssignment?.moduleId ?? "");
  const [title, setTitle] = useState(initialAssignment?.title ?? "");
  const [description, setDescription] = useState(initialAssignment?.description ?? "");
  const [status, setStatus] = useState<AssignmentStatus>(initialAssignment?.status ?? "draft");
  const [dueAt, setDueAt] = useState(toDateTimeLocal(initialAssignment?.dueAt));
  const [maxScore, setMaxScore] = useState(String(initialAssignment?.maxScore ?? 100));
  const [allowResubmission, setAllowResubmission] = useState(initialAssignment?.allowResubmission ?? true);
  const [attachmentFileName, setAttachmentFileName] = useState(initialAssignment?.attachmentFileName ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const availableClassGroups = classGroups.filter((c) => classGroupToProgram.get(c.id) === programId);
  const availableModules = modules.filter((m) => m.programId === programId);

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!programId) nextErrors.programId = "Choose a program.";
    if (!classGroupId) nextErrors.classGroupId = "Choose a class.";
    if (!moduleId) nextErrors.moduleId = "Choose a module.";
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!description.trim()) nextErrors.description = "Instructions are required.";
    if (!dueAt) nextErrors.dueAt = "Due date is required.";
    const scoreNumber = Number(maxScore);
    if (!Number.isFinite(scoreNumber) || scoreNumber <= 0) nextErrors.maxScore = "Enter a valid max score.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const payload = {
        moduleId,
        classGroupId,
        title: title.trim(),
        description: description.trim(),
        status,
        dueAt: new Date(dueAt).toISOString(),
        maxScore: scoreNumber,
        allowResubmission,
        attachmentFileName: attachmentFileName.trim() || undefined,
      };

      if (isEdit && initialAssignment) {
        await updateAssignmentAction(initialAssignment.id, payload);
        router.push(`/admin/assignments/${initialAssignment.id}`);
      } else {
        const { id } = await createAssignmentAction(payload);
        router.push(`/admin/assignments/${id}`);
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="assignment-program">
            Program <span className="text-destructive">*</span>
          </Label>
          <Select
            value={programId || undefined}
            onValueChange={(value) => {
              setProgramId(value);
              setClassGroupId("");
              setModuleId("");
            }}
          >
            <SelectTrigger id="assignment-program" className="w-full" aria-invalid={Boolean(errors.programId)}>
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
          <Label htmlFor="assignment-class">
            Class <span className="text-destructive">*</span>
          </Label>
          <Select value={classGroupId || undefined} onValueChange={setClassGroupId} disabled={!programId}>
            <SelectTrigger id="assignment-class" className="w-full" aria-invalid={Boolean(errors.classGroupId)}>
              <SelectValue placeholder="Select a class">
                {availableClassGroups.find((c) => c.id === classGroupId)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableClassGroups.map((classGroup) => (
                <SelectItem key={classGroup.id} value={classGroup.id}>
                  {classGroup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.classGroupId && <p className="text-xs text-destructive">{errors.classGroupId}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="assignment-module">
            Module <span className="text-destructive">*</span>
          </Label>
          <Select value={moduleId || undefined} onValueChange={setModuleId} disabled={!programId}>
            <SelectTrigger id="assignment-module" className="w-full" aria-invalid={Boolean(errors.moduleId)}>
              <SelectValue placeholder="Select a module">{availableModules.find((m) => m.id === moduleId)?.title}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.code} — {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.moduleId && <p className="text-xs text-destructive">{errors.moduleId}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="assignment-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input id="assignment-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errors.title)} />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="assignment-description">
            Instructions <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="assignment-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="assignment-due">
            Due Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="assignment-due"
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            aria-invalid={Boolean(errors.dueAt)}
          />
          {errors.dueAt && <p className="text-xs text-destructive">{errors.dueAt}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="assignment-max-score">Max Score</Label>
          <Input
            id="assignment-max-score"
            inputMode="numeric"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            aria-invalid={Boolean(errors.maxScore)}
          />
          {errors.maxScore && <p className="text-xs text-destructive">{errors.maxScore}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="assignment-status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as AssignmentStatus)}>
            <SelectTrigger id="assignment-status" className="w-full">
              <SelectValue>{status === "draft" ? "Draft" : status === "published" ? "Published" : "Closed"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="assignment-attachment">Reference Attachment (optional)</Label>
          <Input
            id="assignment-attachment"
            value={attachmentFileName}
            onChange={(e) => setAttachmentFileName(e.target.value)}
            placeholder="starter-files.zip"
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            id="assignment-allow-resubmission"
            checked={allowResubmission}
            onCheckedChange={(checked) => setAllowResubmission(checked === true)}
          />
          <Label htmlFor="assignment-allow-resubmission" className="font-normal">
            Allow students to resubmit before grading
          </Label>
        </div>
      </div>

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Save className="size-4" />
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Assignment"}
      </Button>
    </div>
  );
}
