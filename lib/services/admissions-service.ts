import { applications } from "@/lib/mock-data/applications";
import { generateApplicationReference } from "@/lib/services/application-reference";
import type {
  Application,
  ApplicationDraftInput,
  ApplicationHistoryEntry,
  ApplicationStatus,
} from "@/lib/types";

function nowIso(): string {
  return new Date().toISOString();
}

function pushHistory(app: Application, entry: Omit<ApplicationHistoryEntry, "id" | "timestamp">): void {
  app.history.push({
    id: `hist-${app.id}-${app.history.length + 1}`,
    timestamp: nowIso(),
    ...entry,
  });
}

function findByReference(reference: string): Application | undefined {
  return applications.find((a) => a.reference === reference);
}

function mustFind(reference: string): Application {
  const app = findByReference(reference);
  if (!app) throw new Error(`Application ${reference} was not found.`);
  return app;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  programId?: string;
  query?: string;
}

/**
 * Admissions data access and workflow. Mock-backed (in-memory array as a stand-in database)
 * for this frontend-first phase; a real backend can later replace these function bodies
 * without changing any calling UI code.
 */
export const admissionsService = {
  async listApplications(filters: ApplicationFilters = {}): Promise<Application[]> {
    let results = applications;
    if (filters.status) results = results.filter((a) => a.status === filters.status);
    if (filters.programId) results = results.filter((a) => a.programId === filters.programId);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (a) =>
          a.personalInformation.fullName.toLowerCase().includes(query) ||
          a.reference.toLowerCase().includes(query) ||
          a.personalInformation.email.toLowerCase().includes(query)
      );
    }
    return [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getApplicationByReference(reference: string): Promise<Application | undefined> {
    return findByReference(reference);
  },

  /** Applicant-facing view: strips internal notes and internal-only history entries. */
  async getPublicApplication(
    reference: string
  ): Promise<Omit<Application, "internalNotes"> | undefined> {
    const app = findByReference(reference);
    if (!app) return undefined;
    const { internalNotes, ...rest } = app;
    void internalNotes;
    return { ...rest, history: app.history.filter((h) => h.visibility === "public") };
  },

  async createApplication(input: ApplicationDraftInput): Promise<Application> {
    const sequence = applications.length + 1;
    const reference = generateApplicationReference(sequence);
    const now = nowIso();
    const application: Application = {
      id: `app-${sequence}`,
      reference,
      programId: input.programId,
      learningMode: input.learningMode,
      personalInformation: input.personalInformation,
      education: input.education,
      documents: input.documents,
      status: "submitted",
      createdAt: now,
      submittedAt: now,
      history: [],
    };
    pushHistory(application, { actor: "system", action: "Application created", visibility: "internal" });
    pushHistory(application, {
      actor: "applicant",
      actorName: application.personalInformation.fullName,
      action: "Application submitted",
      visibility: "public",
    });
    applications.push(application);
    return application;
  },

  async markUnderReview(reference: string, actorName: string): Promise<Application> {
    const app = mustFind(reference);
    app.status = "under_review";
    pushHistory(app, { actor: "admissions_staff", actorName, action: "Review started", visibility: "public" });
    return app;
  },

  async requestMoreInformation(reference: string, message: string, actorName: string): Promise<Application> {
    const trimmed = message.trim();
    if (!trimmed) throw new Error("An applicant-facing message is required.");
    const app = mustFind(reference);
    app.status = "more_information_required";
    app.applicantMessage = trimmed;
    pushHistory(app, {
      actor: "admissions_staff",
      actorName,
      action: "Additional information requested",
      description: trimmed,
      visibility: "public",
    });
    return app;
  },

  /** Applicant updates their application after a more-information-required request and resubmits. */
  async resubmitApplication(
    reference: string,
    updates: Partial<Pick<ApplicationDraftInput, "personalInformation" | "education" | "documents">>
  ): Promise<Application> {
    const app = mustFind(reference);
    if (updates.personalInformation) app.personalInformation = updates.personalInformation;
    if (updates.education) app.education = updates.education;
    if (updates.documents) app.documents = updates.documents;
    app.status = "submitted";
    app.applicantMessage = undefined;
    pushHistory(app, {
      actor: "applicant",
      actorName: app.personalInformation.fullName,
      action: "Applicant updated application",
      visibility: "public",
    });
    pushHistory(app, {
      actor: "applicant",
      actorName: app.personalInformation.fullName,
      action: "Applicant resubmitted application",
      visibility: "public",
    });
    return app;
  },

  async approveApplication(reference: string, message: string, actorName: string): Promise<Application> {
    const app = mustFind(reference);
    const decisionMessage = message.trim() || "Congratulations — your application has been approved.";
    app.status = "approved";
    app.decision = { status: "approved", message: decisionMessage, decidedAt: nowIso(), decidedBy: actorName };
    pushHistory(app, {
      actor: "admissions_staff",
      actorName,
      action: "Application approved",
      description: decisionMessage,
      visibility: "public",
    });
    return app;
  },

  async rejectApplication(reference: string, message: string, actorName: string): Promise<Application> {
    const trimmed = message.trim();
    if (!trimmed) throw new Error("A decision message is required.");
    const app = mustFind(reference);
    app.status = "rejected";
    app.decision = { status: "rejected", message: trimmed, decidedAt: nowIso(), decidedBy: actorName };
    pushHistory(app, {
      actor: "admissions_staff",
      actorName,
      action: "Application rejected",
      description: trimmed,
      visibility: "public",
    });
    return app;
  },

  async saveInternalNote(reference: string, note: string, actorName: string): Promise<Application> {
    const app = mustFind(reference);
    app.internalNotes = note;
    pushHistory(app, { actor: "admissions_staff", actorName, action: "Internal note updated", visibility: "internal" });
    return app;
  },

  async getSummaryCounts(): Promise<Record<ApplicationStatus, number>> {
    const counts: Record<ApplicationStatus, number> = {
      draft: 0,
      submitted: 0,
      under_review: 0,
      more_information_required: 0,
      approved: 0,
      rejected: 0,
      enrolled: 0,
    };
    for (const app of applications) counts[app.status] += 1;
    return counts;
  },
};
