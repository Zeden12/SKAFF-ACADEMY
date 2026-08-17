import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants/site";
import { courseService } from "@/lib/services/course-service";

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Campus Location",
    value: "Gisozi, Kigali — near the Gisozi Sector Office / Total Energies station area",
  },
  { icon: Phone, label: "Phone", value: "+250 788 000 000" },
  { icon: Mail, label: "Email", value: "info@skaffacademy.rw" },
  { icon: Clock, label: "Opening Hours", value: "Monday – Friday, 8:00 AM – 5:00 PM" },
];

export default async function ContactPage() {
  const programs = await courseService.listPrograms();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Contact Us</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Reach out to the campus office for admissions or general inquiries.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardHeader>
              <Icon className="size-5 text-primary" />
              <CardTitle className="text-sm">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Send us a message</CardTitle>
          <CardDescription>
            Fill in the form below and the admissions team will get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" disabled />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="program">Program of Interest (optional)</Label>
              <Select disabled>
                <SelectTrigger id="program" className="w-full">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="How can we help?" rows={4} disabled />
            </div>
            <div className="sm:col-span-2">
              <Button type="button" disabled>
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        SKAFF ACADEMY — part of {SITE.parentOrg}.
      </p>
    </div>
  );
}
