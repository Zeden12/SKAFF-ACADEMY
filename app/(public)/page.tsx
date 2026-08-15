import Link from "next/link";
import { ArrowRight, MapPin, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SITE } from "@/lib/constants/site";
import { courseService } from "@/lib/services/course-service";
import { announcementService } from "@/lib/services/announcement-service";

export default async function HomePage() {
  const [programs, announcements] = await Promise.all([
    courseService.listPrograms(),
    announcementService.listAnnouncements(),
  ]);

  return (
    <div>
      <section className="border-b border-border bg-navy">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-sm font-semibold tracking-wide text-primary-foreground/70 uppercase">
            {SITE.location}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {SITE.name}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">{SITE.tagline}</p>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            A campus-based institution offering practical programs, with course materials,
            schedules, and records available through the student portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/admissions">
                Apply for Admission
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/programs">View Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Our Programs</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Certificate, diploma, and short course offerings.
            </p>
          </div>
          <Link
            href="/programs"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View all programs
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <CardTitle className="text-base">{program.name}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="size-3.5" />
                    {program.level.replace("_", " ")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {program.durationMonths} months
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Latest Announcements
          </h2>
          <div className="mt-6 space-y-4">
            {announcements.slice(0, 3).map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle className="text-base">{announcement.title}</CardTitle>
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
        </div>
      </section>

      <section className="border-t border-border bg-deep-blue">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Visit our campus in {SITE.location}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-300">
              <MapPin className="size-4" />
              Most classes are held physically on campus.
            </p>
          </div>
          <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
