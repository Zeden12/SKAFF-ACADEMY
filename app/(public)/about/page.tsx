import { SITE } from "@/lib/constants/site";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">About {SITE.name}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          {SITE.name} is a campus-based institution in {SITE.location}, offering practical
          certificate, diploma, and short course programs. Most learning happens through
          physical classes on campus, supported by a digital campus system for materials,
          schedules, assignments, and records.
        </p>
        <p>
          Occasional online and offsite sessions supplement physical classes where relevant to
          a program&rsquo;s delivery plan.
        </p>
      </div>
    </div>
  );
}
