import type { Result } from "@/lib/types";
import { relativeDay } from "./date-helpers";

export const results: Result[] = [
  {
    id: "res-1",
    studentId: "student-1",
    moduleId: "mod-1",
    assessmentName: "HTML & CSS Foundations Exam",
    score: 85,
    maxScore: 100,
    grade: "B",
    feedback: "Solid grasp of layout fundamentals. Review accessibility attributes for next time.",
    publishedAt: relativeDay(-16, 12),
  },
  {
    id: "res-2",
    studentId: "student-1",
    moduleId: "mod-1",
    assessmentName: "Portfolio Project Assessment",
    score: 88,
    maxScore: 100,
    grade: "B",
    feedback: "Clean structure and great use of semantic HTML.",
    publishedAt: relativeDay(-15, 12),
  },
  {
    id: "res-3",
    studentId: "student-1",
    moduleId: "mod-2",
    assessmentName: "JavaScript Fundamentals Test",
    score: 78,
    maxScore: 100,
    grade: "C",
    feedback: "Good understanding of core syntax. Practice array and object methods further.",
    publishedAt: relativeDay(-7, 12),
  },
];
