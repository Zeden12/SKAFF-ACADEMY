import type { ClassSession } from "@/lib/types";
import { relativeDay } from "./date-helpers";

/** Class sessions for FSD-2026-A (class-1). Dates are relative to "now" for a realistic demo. */
export const classSessions: ClassSession[] = [
  // Module 1 — HTML, CSS & Web Foundations (completed)
  {
    id: "session-1",
    classGroupId: "class-1",
    moduleId: "mod-1",
    mode: "physical",
    title: "Semantic HTML & Page Structure",
    startsAt: relativeDay(-21, 9),
    endsAt: relativeDay(-21, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },
  {
    id: "session-2",
    classGroupId: "class-1",
    moduleId: "mod-1",
    mode: "physical",
    title: "CSS Layout & Responsive Design",
    startsAt: relativeDay(-18, 9),
    endsAt: relativeDay(-18, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },

  // Module 2 — JavaScript Fundamentals (completed)
  {
    id: "session-3",
    classGroupId: "class-1",
    moduleId: "mod-2",
    mode: "physical",
    title: "JavaScript Syntax & Control Flow",
    startsAt: relativeDay(-14, 9),
    endsAt: relativeDay(-14, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },
  {
    id: "session-4",
    classGroupId: "class-1",
    moduleId: "mod-2",
    mode: "physical",
    title: "DOM Manipulation & Events",
    startsAt: relativeDay(-10, 9),
    endsAt: relativeDay(-10, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },
  {
    id: "session-5",
    classGroupId: "class-1",
    moduleId: "mod-2",
    mode: "online",
    title: "JavaScript Review & Q&A",
    startsAt: relativeDay(-6, 18),
    endsAt: relativeDay(-6, 19),
    onlineUrl: "https://meet.google.com/skaff-fsd-2026a",
    staffId: "staff-1",
  },

  // Module 3 — Frontend Development with React (in progress)
  {
    id: "session-6",
    classGroupId: "class-1",
    moduleId: "mod-3",
    mode: "physical",
    title: "Introduction to React Components",
    startsAt: relativeDay(-2, 9),
    endsAt: relativeDay(-2, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },
  {
    id: "session-7",
    classGroupId: "class-1",
    moduleId: "mod-3",
    mode: "physical",
    title: "State, Props & Component Composition",
    startsAt: relativeDay(1, 9),
    endsAt: relativeDay(1, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    notes: "Bring your laptop with Node.js already installed.",
    staffId: "staff-1",
  },
  {
    id: "session-8",
    classGroupId: "class-1",
    moduleId: "mod-3",
    mode: "online",
    title: "React Project Clinic",
    startsAt: relativeDay(4, 18),
    endsAt: relativeDay(4, 19, 30),
    onlineUrl: "https://meet.google.com/skaff-fsd-2026a",
    notes: "Optional drop-in session to get help with your React component library assignment.",
    staffId: "staff-1",
  },

  // Module 4 — Backend Development with Node.js (upcoming)
  {
    id: "session-9",
    classGroupId: "class-1",
    moduleId: "mod-4",
    mode: "physical",
    title: "Building APIs with Node.js and Express",
    startsAt: relativeDay(8, 9),
    endsAt: relativeDay(8, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },

  // Module 5 — Databases & APIs (upcoming, offsite)
  {
    id: "session-10",
    classGroupId: "class-1",
    moduleId: "mod-5",
    mode: "offsite",
    title: "Industry Visit — Database Systems in Production",
    startsAt: relativeDay(15, 10),
    endsAt: relativeDay(15, 13),
    location: "Kigali Innovation City, Kigali",
    notes: "Meet at the campus reception at 9:30am for transport to the venue.",
    staffId: "staff-1",
  },

  // Module 6 — Capstone Project (upcoming)
  {
    id: "session-11",
    classGroupId: "class-1",
    moduleId: "mod-6",
    mode: "physical",
    title: "Capstone Project Kickoff",
    startsAt: relativeDay(30, 9),
    endsAt: relativeDay(30, 12),
    location: "SKAFF ACADEMY Campus — Lab 3",
    staffId: "staff-1",
  },
];
