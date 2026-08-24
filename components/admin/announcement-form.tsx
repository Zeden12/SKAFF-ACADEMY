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
import { ANNOUNCEMENT_CATEGORY_LABELS, ANNOUNCEMENT_AUDIENCE_LABELS } from "@/lib/constants/communication";
import { createAnnouncementAction, updateAnnouncementAction } from "@/lib/actions/announcements-actions";
import type {
  Announcement,
  AnnouncementAudience,
  AnnouncementCategory,
  AnnouncementPublicationStatus,
  ClassGroup,
  Intake,
  Program,
} from "@/lib/types";

const CATEGORIES = Object.keys(ANNOUNCEMENT_CATEGORY_LABELS) as AnnouncementCategory[];
const AUDIENCES = Object.keys(ANNOUNCEMENT_AUDIENCE_LABELS) as AnnouncementAudience[];

interface AnnouncementFormProps {
  programs: Program[];
  intakes: Intake[];
  classGroups: ClassGroup[];
  initialAnnouncement?: Announcement;
}

export function AnnouncementForm({ programs, intakes, classGroups, initialAnnouncement }: AnnouncementFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialAnnouncement);

  const intakeToProgram = useMemo(() => new Map(intakes.map((i) => [i.id, i.programId])), [intakes]);
  const classGroupToProgram = useMemo(
    () => new Map(classGroups.map((c) => [c.id, intakeToProgram.get(c.intakeId)])),
    [classGroups, intakeToProgram]
  );

  const [title, setTitle] = useState(initialAnnouncement?.title ?? "");
  const [body, setBody] = useState(initialAnnouncement?.body ?? "");
  const [category, setCategory] = useState<AnnouncementCategory>(initialAnnouncement?.category ?? "general");
  const [audience, setAudience] = useState<AnnouncementAudience>(initialAnnouncement?.audience ?? "all");
  const [status, setStatus] = useState<AnnouncementPublicationStatus>(initialAnnouncement?.status ?? "draft");
  const [pinned, setPinned] = useState(initialAnnouncement?.pinned ?? false);
  const [programId, setProgramId] = useState(initialAnnouncement?.programId ?? "");
  const [classGroupId, setClassGroupId] = useState(initialAnnouncement?.classGroupId ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const isStudentAudience = audience === "students";
  const availableClassGroups = classGroups.filter((c) => classGroupToProgram.get(c.id) === programId);

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!body.trim()) nextErrors.body = "Body is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        category,
        audience,
        status,
        pinned,
        programId: isStudentAudience && programId ? programId : undefined,
        classGroupId: isStudentAudience && programId && classGroupId ? classGroupId : undefined,
      };

      if (isEdit && initialAnnouncement) {
        await updateAnnouncementAction(initialAnnouncement.id, payload);
        router.push(`/admin/announcements/${initialAnnouncement.id}`);
      } else {
        const { id } = await createAnnouncementAction(payload);
        router.push(`/admin/announcements/${id}`);
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="announcement-title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input id="announcement-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={Boolean(errors.title)} />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="announcement-body">
            Body <span className="text-destructive">*</span>
          </Label>
          <Textarea id="announcement-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} aria-invalid={Boolean(errors.body)} />
          {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="announcement-category">Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as AnnouncementCategory)}>
            <SelectTrigger id="announcement-category" className="w-full">
              <SelectValue>{ANNOUNCEMENT_CATEGORY_LABELS[category]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {ANNOUNCEMENT_CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="announcement-audience">Audience</Label>
          <Select
            value={audience}
            onValueChange={(value) => {
              setAudience(value as AnnouncementAudience);
              setProgramId("");
              setClassGroupId("");
            }}
          >
            <SelectTrigger id="announcement-audience" className="w-full">
              <SelectValue>{ANNOUNCEMENT_AUDIENCE_LABELS[audience]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((a) => (
                <SelectItem key={a} value={a}>
                  {ANNOUNCEMENT_AUDIENCE_LABELS[a]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isStudentAudience && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="announcement-program">Target Program (optional)</Label>
              <Select
                value={programId || "none"}
                onValueChange={(value) => {
                  setProgramId(value === "none" ? "" : value);
                  setClassGroupId("");
                }}
              >
                <SelectTrigger id="announcement-program" className="w-full">
                  <SelectValue placeholder="Academy-wide">
                    {programId ? programs.find((p) => p.id === programId)?.name : "Academy-wide (all programs)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Academy-wide (all programs)</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="announcement-class">Target Class (optional)</Label>
              <Select
                value={classGroupId || "none"}
                onValueChange={(value) => setClassGroupId(value === "none" ? "" : value)}
                disabled={!programId}
              >
                <SelectTrigger id="announcement-class" className="w-full">
                  <SelectValue placeholder="Entire program">
                    {classGroupId ? availableClassGroups.find((c) => c.id === classGroupId)?.name : "Entire program"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Entire program</SelectItem>
                  {availableClassGroups.map((classGroup) => (
                    <SelectItem key={classGroup.id} value={classGroup.id}>
                      {classGroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="announcement-status">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as AnnouncementPublicationStatus)}>
            <SelectTrigger id="announcement-status" className="w-full">
              <SelectValue>{status === "draft" ? "Draft" : status === "published" ? "Published" : "Archived"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <Checkbox id="announcement-pinned" checked={pinned} onCheckedChange={(checked) => setPinned(checked === true)} />
          <Label htmlFor="announcement-pinned" className="font-normal">
            Pin to top of announcements list
          </Label>
        </div>
      </div>

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Save className="size-4" />
        {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Announcement"}
      </Button>
    </div>
  );
}
