import type { Module } from "@/lib/types";

/** Modules for the Full-Stack Software Development program, in teaching order. */
export const modules: Module[] = [
  {
    id: "mod-1",
    programId: "prog-fullstack",
    code: "FSD101",
    title: "HTML, CSS & Web Foundations",
    description: "Structuring and styling web pages with semantic HTML and modern CSS.",
    creditHours: 3,
  },
  {
    id: "mod-2",
    programId: "prog-fullstack",
    code: "FSD102",
    title: "JavaScript Fundamentals",
    description: "Core JavaScript: syntax, DOM manipulation, and everyday programming patterns.",
    creditHours: 4,
  },
  {
    id: "mod-3",
    programId: "prog-fullstack",
    code: "FSD201",
    title: "Frontend Development with React",
    description: "Building component-based user interfaces with React.",
    creditHours: 5,
  },
  {
    id: "mod-4",
    programId: "prog-fullstack",
    code: "FSD202",
    title: "Backend Development with Node.js",
    description: "Server-side programming, routing, and building APIs with Node.js.",
    creditHours: 5,
  },
  {
    id: "mod-5",
    programId: "prog-fullstack",
    code: "FSD203",
    title: "Databases & APIs",
    description: "Data modeling, relational databases, and connecting a frontend to a real API.",
    creditHours: 4,
  },
  {
    id: "mod-6",
    programId: "prog-fullstack",
    code: "FSD301",
    title: "Capstone Project",
    description: "Planning and building a complete full-stack application from scratch.",
    creditHours: 6,
  },
];
