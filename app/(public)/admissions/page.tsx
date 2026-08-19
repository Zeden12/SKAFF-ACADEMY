import Link from "next/link";
import {
  ListChecks,
  FileEdit,
  Upload,
  ClipboardCheck,
  Mail,
  GraduationCap,
  IdCard,
  Image as ImageIcon,
  FileText,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const STEPS = [
  {
    icon: ListChecks,
    title: "Choose a program",
    description: "Browse our technology, digital business, creative production, and professional development programs.",
  },
  {
    icon: FileEdit,
    title: "Complete online application",
    description: "Fill in your details and submit your application for the program you've chosen.",
  },
  {
    icon: Upload,
    title: "Upload required documents",
    description: "Provide identification and any supporting documents requested for your program.",
  },
  {
    icon: ClipboardCheck,
    title: "Application review",
    description: "The admissions team reviews your application and documents.",
  },
  {
    icon: Mail,
    title: "Admission decision",
    description: "You're notified of the outcome of your application.",
  },
  {
    icon: GraduationCap,
    title: "Complete enrollment",
    description: "Accepted applicants complete registration and are placed into a class group.",
  },
];

const WHAT_YOU_MAY_NEED = [
  { icon: IdCard, text: "A valid identification document" },
  { icon: ImageIcon, text: "A recent passport-style photo" },
  { icon: FileText, text: "Academic documents, where required for your program" },
  { icon: Phone, text: "Current contact information (phone and email)" },
];

export default function AdmissionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Admissions</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          SKAFF ACADEMY uses a straightforward digital admissions process. Here&rsquo;s how to
          apply, from choosing a program through to enrollment.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <step.icon className="size-4 text-primary" aria-hidden="true" />
                <CardTitle className="text-base">{step.title}</CardTitle>
              </div>
              <CardDescription className="pl-8">{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3">
        <Button size="lg" asChild>
          <Link href="/admissions/apply">Start Application</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/contact">Contact Admissions</Link>
        </Button>
        <Link
          href="/admissions/status"
          className="text-sm font-medium text-primary hover:underline"
        >
          Already applied? Track your application
        </Link>
      </div>

      <div className="mt-14 rounded-lg border border-border bg-secondary/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">What you may need</h2>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Document requirements can differ by course. As a general guide, applicants are typically
          asked for:
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {WHAT_YOU_MAY_NEED.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground">
          Our admissions team will confirm exactly what&rsquo;s needed once you&rsquo;ve chosen a
          program.
        </p>
      </div>
    </div>
  );
}
