import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentStatusBadge } from "@/components/shared/student-status-badge";
import type { ClassGroup, Intake, Program, StudentProfile, User } from "@/lib/types";

interface StudentSummaryProps {
  user: User;
  student: StudentProfile;
  program?: Program;
  intake?: Intake;
  classGroup?: ClassGroup;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function StudentSummary({ user, student, program, intake, classGroup }: StudentSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials(user.fullName)}
            </span>
            <div>
              <CardTitle className="text-base">{user.fullName}</CardTitle>
              <p className="text-xs text-muted-foreground">{student.studentNumber}</p>
            </div>
          </div>
          <StudentStatusBadge status={student.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label="Program" value={program?.name ?? "—"} />
        <Field label="Intake / Class" value={`${intake?.label ?? "—"}${classGroup ? ` · ${classGroup.name}` : ""}`} />
        <Field label="Email" value={user.email} />
        <Field label="Phone" value={user.phone ?? "—"} />
        <Field label="Address" value={student.address ?? "—"} />
        <Field label="Enrolled Since" value={new Date(student.enrolledAt).toLocaleDateString()} />
      </CardContent>
    </Card>
  );
}

interface AttentionStudentRowProps {
  user: User;
  student: StudentProfile;
  programName?: string;
}

/** Compact single-line variant reused in AttentionList. */
export function StudentAttentionRow({ user, student, programName }: AttentionStudentRowProps) {
  return (
    <Link
      href={`/admin/students/${student.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
          {initials(user.fullName)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{user.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{programName ?? "—"}</p>
        </div>
      </div>
      <StudentStatusBadge status={student.status} />
    </Link>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
