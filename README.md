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
  (public)/         Marketing site: home, programs (+ [slug] detail), admissions,
                     announcements, about, contact
  (auth)/            Login placeholder (no auth logic yet)
  student/           Student portal shell + placeholder routes
  admin/             Staff/admin portal shell + placeholder routes

components/
  ui/                shadcn/ui primitives (button, card, dialog, table, select, ...)
  shared/            Reusable app components (nav, headers, sidebar, status badge,
                     program card, image placeholder, etc.)

lib/
  types/             Domain TypeScript interfaces (User, Program, Enrollment, ...)
  mock-data/         Small in-memory datasets used by the service layer
  services/          Data-access functions the UI calls (student, course, announcement)
  constants/         Site metadata, navigation, program categories, announcement labels
  utils.ts           shadcn `cn()` class-merge helper + date formatting
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

The public program catalog (`lib/mock-data/programs.ts`) reflects SKAFF ACADEMY's real training
areas — Technology, Digital Business, Creative Production, and Professional Development — and
is the single source of truth for the homepage's featured programs, the programs listing, the
program detail pages (`app/(public)/programs/[slug]`), and the admin courses table.

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
- Polished public site reflecting SKAFF ACADEMY's real positioning and program catalog:
  home, programs (grouped by category with detail pages), admissions (6-step process),
  announcements, about, contact — all real content, no lorem-ipsum stand-ins
- Auth route group with a static, non-functional login page
- Student and admin dashboard shells (responsive sidebar + header, mobile nav via Sheet)
- All student and admin nav routes exist as placeholder pages for navigation testing
- Foundational reusable components: AppLogo, PublicHeader/Footer, DashboardSidebar/Header,
  PageHeader, StatusBadge, EmptyState, LoadingState, ConfirmDialog, SearchInput, FilterBar,
  DataTable, ProgramCard, ImagePlaceholder
- Full domain type layer and a mock service abstraction (student, course, announcement)

Not done (by design, out of scope for this stage):
- Authentication / session management
- A working admissions application form, file uploads, and status tracking (the public
  Admissions page explains the process and links to `/programs`; it doesn't collect submissions)
- Any create/edit/delete business logic (buttons that would trigger it are present but
  disabled)
- Backend, database, or real API integration
- Real Academy photography (see Image Placeholders below)

## Image Placeholders

`components/shared/image-placeholder.tsx` renders a neutral bordered box with an icon and
caption wherever a real photo will eventually go (homepage hero, training-area gallery,
program detail banners). It already accepts an optional `src`, so dropping in real photography
later is a one-line change per call site — no component rewrites needed.

## Assumptions

- A single `/login` page serves both account families for now; routing to student vs. staff
  destinations after sign-in is a future concern once auth exists.
- The "Start Application" CTA links to `/programs` (choosing a program is step one of the
  published admissions flow) rather than a form, since building the actual application intake
  is out of scope for this stage.
- Contact phone/email are illustrative placeholders in the same spirit as the pre-existing
  ones; only the campus location (Gisozi, Kigali — near the Sector Office / Total Energies
  area) reflects information provided for this task. Opening hours are a placeholder pending
  confirmation.
- Program fees, durations, entry requirements, and intake dates are intentionally omitted or
  shown as "contact admissions" placeholders everywhere, since none are verified yet —
  `durationMonths` on `Program` stays optional for when real data arrives.
- "What you will learn" bullets are reasonable descriptive copy for each program's subject
  matter, not verified facts, in the same category as normal program-catalog marketing copy.
- Mock data still covers just enough records (programs, two intakes, two students,
  announcements) to prove the type/service/UI wiring.
- The admin dashboard shows navigation shortcuts rather than metrics, since no real
  operational data exists yet and fabricated counts were explicitly out of scope.
- Radix was chosen as the shadcn/ui base library (over the newer Base UI / React Aria options)
  for maturity and documentation depth.

## Next Planned Stage

Build the **Admissions** vertical slice end-to-end: a real multi-step application form UI,
document upload UI, application status tracking, and the admin review queue — still against
the mock service layer, before wiring up real authentication and a backend.
