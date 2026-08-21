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
import { MATERIAL_TYPE_LABELS } from "@/lib/constants/academic-content";
import { createMaterialAction, updateMaterialAction } from "@/lib/actions/academic-actions";
import type {
  ClassGroup,
  Intake,
  LearningMaterial,
  LearningMaterialStatus,
  LearningMaterialType,
  Module,
  Program,
} from "@/lib/types";

interface MaterialFormProps {
  programs: Program[];
  intakes: Intake[];
  classGroups: ClassGroup[];
  modules: Module[];
  initialMaterial?: LearningMaterial;
}

const MATERIAL_TYPES = Object.keys(MATERIAL_TYPE_LABELS) as LearningMaterialType[];

export function MaterialForm({ programs, intakes, classGroups, modules, initialMaterial }: MaterialFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialMaterial);

  const intakeToProgram = useMemo(() => new Map(intakes.map((i) => [i.id, i.programId])), [intakes]);
  const classGroupToProgram = useMemo(
    () => new Map(classGroups.map((c) => [c.id, intakeToProgram.get(c.intakeId)])),
    [classGroups, intakeToProgram]
  );

  const initialProgramId = initialMaterial ? classGroupToProgram.get(initialMaterial.classGroupId) : undefined;

  const [programId, setProgramId] = useState(initialProgramId ?? "");
  const [classGroupId, setClassGroupId] = useState(initialMaterial?.classGroupId ?? "");
  const [moduleId, setModuleId] = useState(initialMaterial?.moduleId ?? "");
  const [title, setTitle] = useState(initialMaterial?.title ?? "");
  const [description, setDescription] = useState(initialMaterial?.description ?? "");
  const [type, setType] = useState<LearningMaterialType>(initialMaterial?.type ?? "document");
  const [status, setStatus] = useState<LearningMaterialStatus>(initialMaterial?.status ?? "draft");
  const [fileUrl, setFileUrl] = useState(initialMaterial?.fileUrl ?? "");
  const [externalUrl, setExternalUrl] = useState(initialMaterial?.externalUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const availableClassGroups = classGroups.filter((c) => classGroupToProgram.get(c.id) === programId);
  const availableModules = modules.filter((m) => m.programId === programId);
  const isLinkType = type === "link";

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!programId) nextErrors.programId = "Choose a program.";
    if (!classGroupId) nextErrors.classGroupId = "Choose a class.";
    if (!moduleId) nextErrors.moduleId = "Choose a module.";
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (isLinkType && !externalUrl.trim()) nextErrors.externalUrl = "An external URL is required for link materials.";
    if (!isLinkType && !fileUrl.trim()) nextErrors.fileUrl = "A file reference is required for this material type.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const payload = {
        moduleId,
        classGroupId,
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        status,
        fileUrl: isLinkType ? undefined : fileUrl.trim(),
        externalUrl: isLinkType ? externalUrl.trim() : undefined,
      };

      if (isEdit && initialMaterial) {
        await updateMaterialAction(initialMaterial.id, payload);
        router.push(`/admin/materials/${initialMaterial.id}`);
      } else {
        const { id } = await createMaterialAction(payload);
        router.push(`/admin/materials/${id}`);
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="material-program">
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
            <SelectTrigger id="material-program" className="w-full" aria-invalid={Boolean(errors.programId)}>
              <SelectValue placeholder="Select a program">
                {programs.find((p) => p.id === programId)?.name}
              </SelectValue>
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
          <Label htmlFor="material-class">
            Class <span className="text-destructive">*</span>
          </Label>
          <Select value={classGroupId || undefined} onValueChange={setClassGroupId} disabled={!programId}>
            <SelectTrigger id="material-class" className="w-full" aria-invalid={Boolean(errors.classGroupId)}>
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
          <Label htmlFor="material-module">
            Module <span className="text-destructive">*</span>
          </Label>
          <Select value={moduleId || undefined} onValueChange={setModuleId} disabled={!programId}>
            <SelectTrigger id="material-module" className="w-full" aria-invalid={Boolean(errors.moduleId)}>
              <SelectValue placeholder="Select a module">
                {availableModules.find((m) => m.id === moduleId)?.title}
              </SelectValue>
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
          <Label htmlFor="material-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input id="material-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errors.title)} />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="material-description">Description</Label>
          <Textarea id="material-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="material-type">Material Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as LearningMaterialType)}>
            <SelectTrigger id="material-type" className="w-full">
              <SelectValue>{MATERIAL_TYPE_LABELS[type]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_TYPES.map((materialType) => (
                <SelectItem key={materialType} value={materialType}>
                  {MATERIAL_TYPE_LABELS[materialType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="material-status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as LearningMaterialStatus)}>
            <SelectTrigger id="material-status" className="w-full">
              <SelectValue>{status === "draft" ? "Draft" : status === "published" ? "Published" : "Archived"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLinkType ? (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="material-external-url">
              External URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="material-external-url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
              aria-invalid={Boolean(errors.externalUrl)}
            />
            {errors.externalUrl && <p className="text-xs text-destructive">{errors.externalUrl}</p>}
          </div>
        ) : (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="material-file-url">
              File Reference <span className="text-destructive">*</span>
            </Label>
            <Input
              id="material-file-url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="/mock-files/example.pdf"
              aria-invalid={Boolean(errors.fileUrl)}
            />
            <p className="text-xs text-muted-foreground">
              Metadata only for this preview — no real file storage is connected yet.
            </p>
            {errors.fileUrl && <p className="text-xs text-destructive">{errors.fileUrl}</p>}
          </div>
        )}
      </div>

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Save className="size-4" />
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Material"}
      </Button>
    </div>
  );
}
