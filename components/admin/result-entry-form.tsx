"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAssessmentAction } from "@/lib/actions/results-actions";
import type { ClassGroup, Intake, Module, Program } from "@/lib/types";

export interface ResultRosterStudent {
  id: string;
  studentNumber: string;
  fullName: string;
  classGroupId: string;
}

interface ResultEntryFormProps {
  programs: Program[];
  intakes: Intake[];
  classGroups: ClassGroup[];
  modules: Module[];
  students: ResultRosterStudent[];
}

export function ResultEntryForm({ programs, intakes, classGroups, modules, students }: ResultEntryFormProps) {
  const router = useRouter();

  const intakeToProgram = useMemo(() => new Map(intakes.map((i) => [i.id, i.programId])), [intakes]);
  const classGroupToProgram = useMemo(
    () => new Map(classGroups.map((c) => [c.id, intakeToProgram.get(c.intakeId)])),
    [classGroups, intakeToProgram]
  );

  const [programId, setProgramId] = useState("");
  const [classGroupId, setClassGroupId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [assessmentName, setAssessmentName] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const availableClassGroups = classGroups.filter((c) => classGroupToProgram.get(c.id) === programId);
  const availableModules = modules.filter((m) => m.programId === programId);
  const roster = students.filter((s) => s.classGroupId === classGroupId);

  function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!programId) nextErrors.programId = "Choose a program.";
    if (!classGroupId) nextErrors.classGroupId = "Choose a class.";
    if (!moduleId) nextErrors.moduleId = "Choose a module.";
    if (!assessmentName.trim()) nextErrors.assessmentName = "Assessment name is required.";
    const maxScoreNumber = Number(maxScore);
    if (!Number.isFinite(maxScoreNumber) || maxScoreNumber <= 0) nextErrors.maxScore = "Enter a valid max score.";
    if (roster.length === 0) nextErrors.roster = "This class has no enrolled students.";

    for (const student of roster) {
      const raw = scores[student.id];
      const value = Number(raw);
      if (!raw?.trim() || !Number.isFinite(value) || value < 0 || value > maxScoreNumber) {
        nextErrors[`score-${student.id}`] = `Enter a score between 0 and ${maxScoreNumber || 0}.`;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    startTransition(async () => {
      const { assessmentId } = await createAssessmentAction({
        classGroupId,
        moduleId,
        assessmentName: assessmentName.trim(),
        maxScore: maxScoreNumber,
        scores: roster.map((student) => ({ studentId: student.id, score: Number(scores[student.id]) })),
      });
      router.push(`/admin/results/${assessmentId}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="result-program">
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
            <SelectTrigger id="result-program" className="w-full" aria-invalid={Boolean(errors.programId)}>
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
          <Label htmlFor="result-class">
            Class <span className="text-destructive">*</span>
          </Label>
          <Select value={classGroupId || undefined} onValueChange={setClassGroupId} disabled={!programId}>
            <SelectTrigger id="result-class" className="w-full" aria-invalid={Boolean(errors.classGroupId)}>
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
          <Label htmlFor="result-module">
            Module <span className="text-destructive">*</span>
          </Label>
          <Select value={moduleId || undefined} onValueChange={setModuleId} disabled={!programId}>
            <SelectTrigger id="result-module" className="w-full" aria-invalid={Boolean(errors.moduleId)}>
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
          <Label htmlFor="result-assessment-name">
            Assessment Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="result-assessment-name"
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            placeholder="e.g. Node.js Backend Exam"
            aria-invalid={Boolean(errors.assessmentName)}
          />
          {errors.assessmentName && <p className="text-xs text-destructive">{errors.assessmentName}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="result-max-score">
            Max Score <span className="text-destructive">*</span>
          </Label>
          <Input
            id="result-max-score"
            inputMode="numeric"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            aria-invalid={Boolean(errors.maxScore)}
          />
          {errors.maxScore && <p className="text-xs text-destructive">{errors.maxScore}</p>}
        </div>
      </div>

      {classGroupId && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Student Scores</p>
          {errors.roster && <p className="text-xs text-destructive">{errors.roster}</p>}
          {roster.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Student Number</th>
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Score (out of {maxScore || 0})</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((student) => (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="p-3 align-top text-muted-foreground">{student.studentNumber}</td>
                      <td className="p-3 align-top font-medium text-foreground">{student.fullName}</td>
                      <td className="p-3 align-top">
                        <Input
                          inputMode="numeric"
                          className="w-28"
                          value={scores[student.id] ?? ""}
                          onChange={(e) => setScores((prev) => ({ ...prev, [student.id]: e.target.value }))}
                          aria-invalid={Boolean(errors[`score-${student.id}`])}
                        />
                        {errors[`score-${student.id}`] && (
                          <p className="mt-1 text-xs text-destructive">{errors[`score-${student.id}`]}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Button type="button" onClick={handleSubmit} disabled={isPending}>
        <Save className="size-4" />
        {isPending ? "Saving…" : "Save as Draft"}
      </Button>
      <p className="text-xs text-muted-foreground">
        New assessments are saved as a draft. Publish them from the assessment page once scores are confirmed.
      </p>
    </div>
  );
}
