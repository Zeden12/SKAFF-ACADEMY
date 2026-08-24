import type { Result, ResultGrade, ResultHistoryEntry, ResultPublicationStatus } from "@/lib/types";
import { results, resultHistory } from "@/lib/mock-data/results";

export interface ResultsSummary {
  averagePercentage: number;
  completedAssessments: number;
  latestResult?: Result;
}

export interface AssessmentScoreInput {
  studentId: string;
  score: number;
  feedback?: string;
}

export interface CreateAssessmentInput {
  classGroupId: string;
  moduleId: string;
  assessmentName: string;
  maxScore: number;
  recordedByStaffId: string;
  scores: AssessmentScoreInput[];
}

export interface AssessmentSummary {
  assessmentId: string;
  assessmentName: string;
  classGroupId: string;
  moduleId: string;
  maxScore: number;
  status: ResultPublicationStatus;
  publishedAt?: string;
  studentCount: number;
  averagePercentage: number;
}

export interface AssessmentFilters {
  query?: string;
  classGroupId?: string;
  moduleId?: string;
  status?: ResultPublicationStatus;
}

function deriveGrade(percentage: number): ResultGrade {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  if (percentage >= 50) return "E";
  return "F";
}

function sortByNewest(items: Result[]): Result[] {
  return [...items].sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
}

function toAssessmentSummary(rows: Result[]): AssessmentSummary {
  const first = rows[0];
  const averagePercentage = Math.round(
    rows.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / rows.length
  );
  return {
    assessmentId: first.assessmentId,
    assessmentName: first.assessmentName,
    classGroupId: first.classGroupId,
    moduleId: first.moduleId,
    maxScore: first.maxScore,
    status: first.status,
    publishedAt: first.publishedAt,
    studentCount: rows.length,
    averagePercentage,
  };
}

/**
 * Formal Results data access — distinct from assignment grading. Mock-backed for now (in-memory
 * arrays act as a stand-in database); swap the function bodies for real API calls later without
 * changing any calling UI code. Student-facing reads only ever return "published" results, and
 * every row belonging to one assessment shares an assessmentId so publish/correct actions can
 * operate on the whole group at once.
 */
export const resultsService = {
  // --- Student-facing (published only) ---

  async listResultsForStudent(studentId: string): Promise<Result[]> {
    return sortByNewest(results.filter((r) => r.studentId === studentId && r.status === "published"));
  },

  async getResultsSummary(studentId: string): Promise<ResultsSummary> {
    const studentResults = await resultsService.listResultsForStudent(studentId);
    if (studentResults.length === 0) {
      return { averagePercentage: 0, completedAssessments: 0 };
    }
    const totalPercentage = studentResults.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0);
    return {
      averagePercentage: Math.round(totalPercentage / studentResults.length),
      completedAssessments: studentResults.length,
      latestResult: studentResults[0],
    };
  },

  // --- Admin-facing (all statuses) ---

  async listAllResultsForStudent(studentId: string): Promise<Result[]> {
    return sortByNewest(results.filter((r) => r.studentId === studentId));
  },

  async listAssessments(filters: AssessmentFilters = {}): Promise<AssessmentSummary[]> {
    const groups = new Map<string, Result[]>();
    for (const result of results) {
      if (!groups.has(result.assessmentId)) groups.set(result.assessmentId, []);
      groups.get(result.assessmentId)!.push(result);
    }

    let summaries = [...groups.values()].map(toAssessmentSummary);
    if (filters.classGroupId) summaries = summaries.filter((s) => s.classGroupId === filters.classGroupId);
    if (filters.moduleId) summaries = summaries.filter((s) => s.moduleId === filters.moduleId);
    if (filters.status) summaries = summaries.filter((s) => s.status === filters.status);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      summaries = summaries.filter((s) => s.assessmentName.toLowerCase().includes(query));
    }
    return summaries.sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
  },

  async getAssessmentResults(assessmentId: string): Promise<Result[]> {
    return results.filter((r) => r.assessmentId === assessmentId);
  },

  async createAssessment(input: CreateAssessmentInput): Promise<AssessmentSummary> {
    if (input.maxScore <= 0) throw new Error("Max score must be greater than 0.");
    if (input.scores.length === 0) throw new Error("At least one student score is required.");
    for (const entry of input.scores) {
      if (entry.score < 0 || entry.score > input.maxScore) {
        throw new Error(`Score must be between 0 and ${input.maxScore}.`);
      }
    }

    const assessmentId = `assessment-${Date.now()}`;
    const created: Result[] = input.scores.map((entry, index) => {
      const percentage = (entry.score / input.maxScore) * 100;
      return {
        id: `res-${results.length + index + 1}`,
        assessmentId,
        studentId: entry.studentId,
        classGroupId: input.classGroupId,
        moduleId: input.moduleId,
        assessmentName: input.assessmentName,
        score: entry.score,
        maxScore: input.maxScore,
        grade: deriveGrade(percentage),
        feedback: entry.feedback?.trim() || undefined,
        status: "draft",
        recordedByStaffId: input.recordedByStaffId,
      };
    });
    results.push(...created);
    return toAssessmentSummary(created);
  },

  /** Updates draft scores only — published results must go through correctResult to keep an audit trail. */
  async updateDraftScores(assessmentId: string, scores: AssessmentScoreInput[]): Promise<void> {
    const rows = results.filter((r) => r.assessmentId === assessmentId);
    if (rows.length === 0) throw new Error(`Assessment ${assessmentId} was not found.`);
    if (rows[0].status !== "draft") throw new Error("Only draft assessments can be edited directly.");

    for (const entry of scores) {
      const row = rows.find((r) => r.studentId === entry.studentId);
      if (!row) continue;
      if (entry.score < 0 || entry.score > row.maxScore) {
        throw new Error(`Score must be between 0 and ${row.maxScore}.`);
      }
      row.score = entry.score;
      row.grade = deriveGrade((entry.score / row.maxScore) * 100);
      row.feedback = entry.feedback?.trim() || undefined;
    }
  },

  async publishAssessment(assessmentId: string): Promise<void> {
    const rows = results.filter((r) => r.assessmentId === assessmentId);
    if (rows.length === 0) throw new Error(`Assessment ${assessmentId} was not found.`);
    const publishedAt = new Date().toISOString();
    for (const row of rows) {
      row.status = "published";
      row.publishedAt = publishedAt;
    }
  },

  /** Corrects a single student's already-published score, preserving the prior value in history. */
  async correctResult(resultId: string, newScore: number, actorName: string, reason?: string): Promise<Result> {
    const result = results.find((r) => r.id === resultId);
    if (!result) throw new Error(`Result ${resultId} was not found.`);
    if (result.status !== "published") throw new Error("Only published results can be corrected.");
    if (newScore < 0 || newScore > result.maxScore) {
      throw new Error(`Score must be between 0 and ${result.maxScore}.`);
    }

    resultHistory.push({
      id: `rh-${resultHistory.length + 1}`,
      resultId,
      timestamp: new Date().toISOString(),
      actorName,
      previousScore: result.score,
      newScore,
      reason: reason?.trim() || undefined,
    });

    result.score = newScore;
    result.grade = deriveGrade((newScore / result.maxScore) * 100);
    return result;
  },

  async getResultHistory(resultId: string): Promise<ResultHistoryEntry[]> {
    return [...resultHistory.filter((h) => h.resultId === resultId)].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
};
