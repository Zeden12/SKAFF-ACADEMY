"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_STATUS_LABELS } from "@/lib/constants/student-portal";
import { saveAttendanceAction } from "@/lib/actions/attendance-actions";
import type { AttendanceRecord, AttendanceStatus, StudentProfile, User } from "@/lib/types";

const STATUS_OPTIONS: AttendanceStatus[] = ["present", "absent", "late", "excused"];

export interface AttendanceRosterRow {
  student: StudentProfile;
  user: User;
  existingRecord?: AttendanceRecord;
}

interface AttendanceRosterFormProps {
  classSessionId: string;
  rows: AttendanceRosterRow[];
}

export function AttendanceRosterForm({ classSessionId, rows }: AttendanceRosterFormProps) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(rows.map((row) => [row.student.id, row.existingRecord?.status ?? "present"]))
  );
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((row) => [row.student.id, row.existingRecord?.note ?? ""]))
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await saveAttendanceAction(
        classSessionId,
        rows.map((row) => ({
          studentId: row.student.id,
          status: statuses[row.student.id],
          note: notes[row.student.id]?.trim() || undefined,
        }))
      );
      router.refresh();
      setSaved(true);
    });
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="p-3 font-medium">Student Number</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.student.id} className="border-b border-border last:border-0">
                <td className="p-3 align-top text-muted-foreground">{row.student.studentNumber}</td>
                <td className="p-3 align-top font-medium text-foreground">{row.user.fullName}</td>
                <td className="p-3 align-top">
                  <Select
                    value={statuses[row.student.id]}
                    onValueChange={(value) =>
                      setStatuses((prev) => ({ ...prev, [row.student.id]: value as AttendanceStatus }))
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue>{ATTENDANCE_STATUS_LABELS[statuses[row.student.id]]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {ATTENDANCE_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 align-top">
                  <Input
                    value={notes[row.student.id] ?? ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [row.student.id]: e.target.value }))}
                    placeholder="Optional note"
                    className="w-56"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Saving…" : "Save Attendance"}
        </Button>
        {saved && !isPending && <span className="text-xs text-success">Attendance saved.</span>}
      </div>
    </div>
  );
}
