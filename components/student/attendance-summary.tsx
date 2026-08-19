import { AlertTriangle } from "lucide-react";
import { ProgressSummary } from "@/components/student/progress-summary";
import { ATTENDANCE_ATTENTION_THRESHOLD } from "@/lib/constants/student-portal";
import type { AttendanceSummaryCounts } from "@/lib/services/attendance-service";

interface AttendanceSummaryProps {
  summary: AttendanceSummaryCounts;
  compact?: boolean;
}

export function AttendanceSummary({ summary, compact = false }: AttendanceSummaryProps) {
  const needsAttention = summary.total > 0 && summary.presentRate < ATTENDANCE_ATTENTION_THRESHOLD;

  return (
    <div className="space-y-3">
      <ProgressSummary
        label="Overall Attendance"
        valueLabel={`${summary.presentRate}%`}
        percentage={summary.presentRate}
        tone={needsAttention ? "warning" : "default"}
      />

      {!compact && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <Count label="Present" value={summary.present} />
          <Count label="Absent" value={summary.absent} />
          <Count label="Late" value={summary.late} />
          <Count label="Excused" value={summary.excused} />
        </div>
      )}

      {needsAttention && (
        <p className="flex items-start gap-1.5 text-xs text-warning">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          Your attendance requires attention.
        </p>
      )}
    </div>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border py-2">
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
