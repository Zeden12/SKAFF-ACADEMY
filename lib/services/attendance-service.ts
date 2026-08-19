import type { AttendanceRecord, AttendanceStatus } from "@/lib/types";
import { attendanceRecords } from "@/lib/mock-data/attendance";

export interface AttendanceSummaryCounts {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  presentRate: number;
}

const COUNTABLE_STATUSES: AttendanceStatus[] = ["present", "absent", "late", "excused"];

/**
 * Attendance data access. Mock-backed for now; swap the function bodies for real API calls
 * later without changing any calling UI code.
 */
export const attendanceService = {
  async listAttendanceForStudent(studentId: string): Promise<AttendanceRecord[]> {
    return [...attendanceRecords.filter((a) => a.studentId === studentId)].sort(
      (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );
  },

  async getAttendanceSummary(studentId: string): Promise<AttendanceSummaryCounts> {
    const records = await attendanceService.listAttendanceForStudent(studentId);
    const counts = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const record of records) {
      if (COUNTABLE_STATUSES.includes(record.status)) counts[record.status] += 1;
    }
    const total = counts.present + counts.absent + counts.late + counts.excused;
    const presentRate = total > 0 ? Math.round((counts.present / total) * 100) : 0;
    return { ...counts, total, presentRate };
  },
};
