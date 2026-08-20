import type { ClassSession } from "@/lib/types";
import { classSessions } from "@/lib/mock-data/class-sessions";

export type ModuleProgressState = "completed" | "current" | "upcoming";

/** Derives a module's progress purely from whether its sessions are in the past or future. */
export function deriveModuleState(sessions: ClassSession[]): ModuleProgressState {
  if (sessions.length === 0) return "upcoming";
  const now = Date.now();
  const hasFuture = sessions.some((s) => new Date(s.endsAt).getTime() >= now);
  const hasPast = sessions.some((s) => new Date(s.endsAt).getTime() < now);
  if (!hasFuture) return "completed";
  if (hasPast) return "current";
  return "upcoming";
}

/**
 * Class schedule data access. Mock-backed for now; swap the function bodies for real API
 * calls later without changing any calling UI code.
 */
export const scheduleService = {
  async listSessionsForClassGroup(classGroupId: string): Promise<ClassSession[]> {
    return [...classSessions.filter((s) => s.classGroupId === classGroupId)].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  },

  async listUpcomingSessions(classGroupId: string): Promise<ClassSession[]> {
    const now = Date.now();
    const sessions = await scheduleService.listSessionsForClassGroup(classGroupId);
    return sessions.filter((s) => new Date(s.endsAt).getTime() >= now);
  },

  async listPastSessions(classGroupId: string): Promise<ClassSession[]> {
    const now = Date.now();
    const sessions = await scheduleService.listSessionsForClassGroup(classGroupId);
    return sessions.filter((s) => new Date(s.endsAt).getTime() < now);
  },

  async getNextSession(classGroupId: string): Promise<ClassSession | undefined> {
    const upcoming = await scheduleService.listUpcomingSessions(classGroupId);
    return upcoming[0];
  },

  async listSessionsForModule(moduleId: string): Promise<ClassSession[]> {
    return classSessions.filter((s) => s.moduleId === moduleId);
  },

  async getSession(sessionId: string): Promise<ClassSession | undefined> {
    return classSessions.find((s) => s.id === sessionId);
  },

  async listAllSessions(): Promise<ClassSession[]> {
    return [...classSessions].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  },

  async listSessionsToday(): Promise<ClassSession[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    const all = await scheduleService.listAllSessions();
    return all.filter((s) => {
      const startsAt = new Date(s.startsAt).getTime();
      return startsAt >= startOfDay && startsAt < endOfDay;
    });
  },

  async listSessionsThisWeek(): Promise<ClassSession[]> {
    const now = Date.now();
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
    const all = await scheduleService.listAllSessions();
    return all.filter((s) => {
      const startsAt = new Date(s.startsAt).getTime();
      return startsAt >= now && startsAt < weekFromNow;
    });
  },
};
