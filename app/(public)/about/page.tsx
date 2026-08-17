import { SITE } from "@/lib/constants/site";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">About {SITE.name}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          SKAFF ACADEMY is the education and professional development subsidiary of{" "}
          {SITE.parentOrg}, focused on practical knowledge, technical expertise, leadership,
          entrepreneurship, and future-ready skills.
        </p>
        <p>
          Based in {SITE.location}, SKAFF ACADEMY is a physical-campus-first institution — most
          learning happens through hands-on classes at our Kigali campus, taught by trainers with
          real industry experience. Programs are built around practical, applied skills rather
          than theory alone, so what you learn is directly relevant to the work you&rsquo;ll do
          afterward.
        </p>
        <p>
          A digital campus system supports on-campus learning with materials, schedules, and
          announcements available anytime, and enables occasional online or offsite sessions
          where they add value to a program.
        </p>
        <p>
          As part of the wider SKAFF ecosystem, SKAFF ACADEMY connects learners to real business
          and industry context, and views education as a continuous, lifelong process — not a
          single milestone.
        </p>
      </div>
    </div>
  );
}
