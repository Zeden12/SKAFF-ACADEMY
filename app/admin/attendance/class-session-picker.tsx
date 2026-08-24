"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { ClassGroup, ClassSession } from "@/lib/types";

interface ClassSessionPickerProps {
  classGroups: (ClassGroup & { programName: string })[];
  sessions: ClassSession[];
  moduleNameById: Record<string, string>;
  selectedClassId: string;
  selectedSessionId: string;
}

export function ClassSessionPicker({
  classGroups,
  sessions,
  moduleNameById,
  selectedClassId,
  selectedSessionId,
}: ClassSessionPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectClass(classGroupId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("class", classGroupId);
    params.delete("session");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function selectSession(sessionId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("session", sessionId);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="max-w-sm space-y-1.5">
        <label className="text-sm font-medium text-foreground">Class</label>
        <Select value={selectedClassId || undefined} onValueChange={selectClass}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a class">
              {classGroups.find((c) => c.id === selectedClassId)
                ? `${classGroups.find((c) => c.id === selectedClassId)!.name} — ${classGroups.find((c) => c.id === selectedClassId)!.programName}`
                : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {classGroups.map((classGroup) => (
              <SelectItem key={classGroup.id} value={classGroup.id}>
                {classGroup.name} — {classGroup.programName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClassId && (
        <div className="max-w-sm space-y-1.5">
          <label className="text-sm font-medium text-foreground">Session</label>
          <Select value={selectedSessionId || undefined} onValueChange={selectSession}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a session">
                {sessions.find((s) => s.id === selectedSessionId)?.title}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {formatDate(session.startsAt)} · {moduleNameById[session.moduleId] ?? "—"} — {session.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
