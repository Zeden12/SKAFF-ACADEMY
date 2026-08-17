import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Laptop,
  MapPinned,
  Hammer,
  Briefcase,
  Users,
  FolderOpen,
  GraduationCap,
  Code2,
  Video,
  Mic2,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { ProgramCard } from "@/components/shared/program-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SITE } from "@/lib/constants/site";
import { courseService } from "@/lib/services/course-service";
import { announcementService } from "@/lib/services/announcement-service";

const WHY_SKAFF = [
  {
    icon: Hammer,
    title: "Hands-on training",
    description: "Coursework is built around practical exercises, not just lectures.",
  },
  {
    icon: FolderOpen,
    title: "Real-world projects",
    description: "Learners build portfolio-ready work that reflects real industry tasks.",
  },
  {
    icon: Briefcase,
    title: "Industry-oriented learning",
    description: "Programs are shaped around the skills employers and clients actually need.",
  },
  {
    icon: Users,
    title: "Experienced trainers",
    description: "Instructors bring practical, hands-on experience into the classroom.",
  },
  {
    icon: Laptop,
    title: "Materials available online",
    description: "Course materials and resources stay accessible through the student portal.",
  },
  {
    icon: GraduationCap,
    title: "Industry-experience opportunities",
    description:
      "Students may access internship and industry-experience opportunities through the wider SKAFF business ecosystem and external industry relationships.",
  },
];

const LEARNING_MODES = [
  {
    icon: Building2,
    title: "On-Campus Learning",
    description:
      "Most instruction happens through physical classes at our Gisozi campus in Kigali — this is the primary way students learn at SKAFF ACADEMY.",
    primary: true,
  },
  {
    icon: Laptop,
    title: "Online Support",
    description:
      "Materials, resources, and occasional online sessions support and extend campus learning.",
  },
  {
    icon: MapPinned,
    title: "Offsite / Industry Learning",
    description:
      "Select programs include offsite or industry-based sessions where relevant to the skill being taught.",
  },
];

const TRAINING_GALLERY = [
  { icon: Code2, label: "Software development training" },
  { icon: Video, label: "Video production" },
  { icon: Mic2, label: "Audio production" },
  { icon: PenTool, label: "UI/UX design" },
  { icon: Users, label: "Instructor-led practical session" },
];

export default async function HomePage() {
  const [featuredPrograms, announcements] = await Promise.all([
    courseService.listFeaturedPrograms(),
    announcementService.listAnnouncements(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-navy">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary-foreground/70 uppercase">
              {SITE.location}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build Practical Skills for the Future
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
              SKAFF ACADEMY provides practical, industry-focused training in technology, creative
              production, digital skills and professional development. Learn on campus, access
              materials online, and build skills you can apply in the real world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/admissions">
                  Apply for Admission
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
          <ImagePlaceholder
            alt="Instructor guiding students during a hands-on practical training session at the SKAFF ACADEMY campus"
            label="Campus training session"
            icon={Users}
            aspectClassName="aspect-[4/3]"
            className="border-white/10 bg-white/5"
          />
        </div>
      </section>

      {/* Featured Programs */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Featured Programs
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A sample of our technology, digital business, creative production, and
              professional development programs.
            </p>
          </div>
          <Link
            href="/programs"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View all programs
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        <Link
          href="/programs"
          className="mt-6 block text-sm font-medium text-primary hover:underline sm:hidden"
        >
          View all programs
        </Link>
      </section>

      {/* Practical Learning / Why SKAFF Academy */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Practical Learning at SKAFF ACADEMY
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Training is designed to be applied, not just studied.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_SKAFF.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TRAINING_GALLERY.map(({ icon, label }) => (
              <ImagePlaceholder
                key={label}
                alt={`${label} at SKAFF ACADEMY`}
                label={label}
                icon={icon}
                aspectClassName="aspect-square"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Modes */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Learning Modes</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Most learning at SKAFF ACADEMY happens physically at campus.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {LEARNING_MODES.map(({ icon: Icon, title, description, primary }) => (
              <Card key={title} className={primary ? "ring-primary/30" : undefined}>
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                  </span>
                  <div className="flex items-center gap-2 pt-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                    {primary && <StatusBadge status="primary" tone="info" label="Most classes" />}
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="border-t border-border bg-deep-blue">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Start your application today
            </h2>
            <p className="mt-1 max-w-lg text-sm text-slate-300">
              Choose a program and our admissions team will guide you through the rest of the
              process.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/admissions">Start Application</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/contact">Contact Admissions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Latest Announcements
        </h2>
        <div className="mt-6 space-y-4">
          {announcements.slice(0, 3).map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{announcement.title}</CardTitle>
                  {announcement.pinned && (
                    <StatusBadge status="pinned" tone="info" label="Pinned" />
                  )}
                </div>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/announcements" className="text-sm font-medium text-primary hover:underline">
            View all announcements
          </Link>
        </div>
      </section>
    </div>
  );
}
