import type { ClassSession, ClassSessionMode } from "@/lib/types";
import { classSessions } from "@/lib/mock-data/class-sessions";
import { courseService } from "@/lib/services/course-service";

export type ModuleProgressState = "completed" | "current" | "upcoming";

export interface CreateSessionInput {
  classGroupId: string;
  moduleId: string;
  staffId: string;
  mode: ClassSessionMode;
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  onlineUrl?: string;
  notes?: string;
}

export type UpdateSessionInput = Partial<CreateSessionInput>;

/** A session can never float without a valid class, and its module must belong to that
 *  class's program — never an unrelated module. */
async function assertValidClassAndModule(classGroupId: string, moduleId: string): Promise<void> {
  const classGroup = await courseService.getClassGroup(classGroupId);
  if (!classGroup) throw new Error("A valid class is required.");
  const intake = await courseService.getIntake(classGroup.intakeId);
  const mod = await courseService.getModule(moduleId);
  if (!intake || !mod || mod.programId !== intake.programId) {
    throw new Error("The selected module does not belong to this class's program.");
  }
}

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

  /** Sessions already underway or finished, most recent first — the ones attendance can be taken for. */
  async listSessionsEligibleForAttendance(classGroupId: string): Promise<ClassSession[]> {
    const now = Date.now();
    const sessions = await scheduleService.listSessionsForClassGroup(classGroupId);
    return [...sessions.filter((s) => new Date(s.startsAt).getTime() <= now)].sort(
      (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
    );
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

  async listAllUpcomingSessions(): Promise<ClassSession[]> {
    const now = Date.now();
    const all = await scheduleService.listAllSessions();
    return all.filter((s) => new Date(s.endsAt).getTime() >= now);
  },

  async listAllPastSessions(): Promise<ClassSession[]> {
    const now = Date.now();
    const all = await scheduleService.listAllSessions();
    return [...all.filter((s) => new Date(s.endsAt).getTime() < now)].reverse();
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

  // --- Admin-facing create/edit ---

  async createSession(input: CreateSessionInput): Promise<ClassSession> {
    await assertValidClassAndModule(input.classGroupId, input.moduleId);
    if (new Date(input.endsAt).getTime() <= new Date(input.startsAt).getTime()) {
      throw new Error("End time must be after the start time.");
    }
    const session: ClassSession = {
      id: `session-${classSessions.length + 1}`,
      classGroupId: input.classGroupId,
      moduleId: input.moduleId,
      staffId: input.staffId,
      mode: input.mode,
      title: input.title,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      location: input.mode !== "online" ? input.location : undefined,
      onlineUrl: input.mode === "online" ? input.onlineUrl : undefined,
      notes: input.notes,
    };
    classSessions.push(session);
    return session;
  },

  async updateSession(sessionId: string, updates: UpdateSessionInput): Promise<ClassSession> {
    const session = classSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error(`Session ${sessionId} was not found.`);

    const nextClassGroupId = updates.classGroupId ?? session.classGroupId;
    const nextModuleId = updates.moduleId ?? session.moduleId;
    await assertValidClassAndModule(nextClassGroupId, nextModuleId);

    const nextStartsAt = updates.startsAt ?? session.startsAt;
    const nextEndsAt = updates.endsAt ?? session.endsAt;
    if (new Date(nextEndsAt).getTime() <= new Date(nextStartsAt).getTime()) {
      throw new Error("End time must be after the start time.");
    }

    Object.assign(session, updates);
    session.location = session.mode !== "online" ? (updates.location ?? session.location) : undefined;
    session.onlineUrl = session.mode === "online" ? (updates.onlineUrl ?? session.onlineUrl) : undefined;
    return session;
  },
};
