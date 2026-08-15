# SKAFF ACADEMY — Digital Campus System

A physical-campus-first digital campus platform for SKAFF ACADEMY in Kigali, Rwanda. Most
learning happens through physical classes on campus; this platform supports admissions, course
information, learning materials, schedules, occasional online/offsite sessions, announcements,
assignments, attendance, results, fees status, document requests, and administration.

There are two account families: **STUDENT** and **STAFF** (staff covers both teaching and
administrative roles — there is no separate teacher account type).

This repository currently contains the **frontend architecture and design foundation only**.
No backend, authentication, or feature logic has been implemented yet.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com) with CSS-variable design tokens
- [shadcn/ui](https://ui.shadcn.com) (Radix primitives) + [Lucide](https://lucide.dev) icons
- ESLint

## Project Structure

```
app/
  (public)/         Marketing site: home, programs, admissions, announcements, about, contact
  (auth)/            Login placeholder (no auth logic yet)
  student/           Student portal shell + placeholder routes
  admin/             Staff/admin portal shell + placeholder routes

components/
  ui/                shadcn/ui primitives (button, card, dialog, table, ...)
  shared/            Reusable app components (nav, headers, sidebar, status badge, etc.)

lib/
  types/             Domain TypeScript interfaces (User, Program, Enrollment, ...)
  mock-data/         Small in-memory datasets used by the service layer
  services/          Data-access functions the UI calls (student, course, announcement)
  constants/         Site metadata and navigation configuration
  utils.ts           shadcn `cn()` class-merge helper
```

Route groups `(public)` and `(auth)` keep marketing and authentication pages out of the URL
path while still isolating their layouts from the dashboard shells.

## Design System

Colors are defined as CSS custom properties in [app/globals.css](app/globals.css) (light and
dark variants) and consumed as Tailwind utilities (`bg-primary`, `text-navy`, `border-border`,
etc.) rather than hardcoded hex values. The palette is a restrained institutional blue/navy/
neutral system — no gradients, glassmorphism, or decorative illustration. Body font is
[Public Sans](https://public-sans.digital.gov), chosen for its institutional, government/
education-site character.

## Data Architecture

Domain types in `lib/types/` model the full future system (Program → Intake → ClassGroup →
Enrollment hierarchy, applications, learning materials, attendance, results, payments,
announcements, etc.) even though only a fraction of them are rendered today. UI code never
imports mock arrays directly — it goes through `lib/services/*`, so mock data can later be
swapped for real API calls without touching components.

## Running Locally

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

## Current Implementation Status

Done:
- Project scaffold, Tailwind v4 + shadcn/ui setup, design tokens, typography
- Public layout (header/footer) with all six public routes as real pages (not stubs)
- Auth route group with a static, non-functional login page
- Student and admin dashboard shells (responsive sidebar + header, mobile nav via Sheet)
- All student and admin nav routes exist as placeholder pages for navigation testing
- Foundational reusable components: AppLogo, PublicHeader/Footer, DashboardSidebar/Header,
  PageHeader, StatusBadge, EmptyState, LoadingState, ConfirmDialog, SearchInput, FilterBar,
  DataTable
- Full domain type layer and a mock service abstraction (student, course, announcement)

Not done (by design, out of scope for this stage):
- Authentication / session management
- Admissions workflow, forms, and file uploads
- Any create/edit/delete business logic (buttons that would trigger it are present but
  disabled)
- Backend, database, or real API integration

## Assumptions

- A single `/login` page serves both account families for now; routing to student vs. staff
  destinations after sign-in is a future concern once auth exists.
- Mock data covers just enough records (a couple of programs, intakes, students,
  announcements) to prove the type/service/UI wiring — it is not meant to look like production
  content.
- The admin dashboard shows navigation shortcuts rather than metrics, since no real
  operational data exists yet and fabricated counts were explicitly out of scope.
- Radix was chosen as the shadcn/ui base library (over the newer Base UI / React Aria options)
  for maturity and documentation depth.

## Next Planned Stage

Pick one vertical slice (recommended: **Admissions**, since it is the first thing a
prospective student touches) and build it end-to-end: application form UI, document upload
UI, application status tracking, and the admin review queue — still against the mock service
layer, before wiring up real authentication and a backend.
