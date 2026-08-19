import type { Result } from "@/lib/types";
import { results } from "@/lib/mock-data/results";

export interface ResultsSummary {
  averagePercentage: number;
  completedAssessments: number;
  latestResult?: Result;
}

/**
 * Results data access. Mock-backed for now; swap the function bodies for real API calls
 * later without changing any calling UI code.
 */
export const resultsService = {
  async listResultsForStudent(studentId: string): Promise<Result[]> {
    return [...results.filter((r) => r.studentId === studentId)].sort(
      (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
    );
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
};
