import type { Announcement } from "@/lib/types";

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "January intake registration now open",
    body: "Registration for the January 2026 Diploma in Business Administration intake is now open. Visit the campus registrar's office or apply online before the deadline.",
    audience: "all",
    publishedAt: "2025-11-20",
    authorStaffId: "staff-1",
    pinned: true,
  },
  {
    id: "ann-2",
    title: "Campus closed for national holiday",
    body: "The campus will be closed on the upcoming public holiday. Classes resume the following business day on the normal schedule.",
    audience: "all",
    publishedAt: "2025-12-01",
    authorStaffId: "staff-1",
  },
  {
    id: "ann-3",
    title: "Software Development lab hours extended",
    body: "Lab 3 will remain open until 8pm on weekdays for the remainder of the term to support project work.",
    audience: "students",
    publishedAt: "2025-12-08",
    authorStaffId: "staff-2",
  },
];
