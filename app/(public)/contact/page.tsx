import { MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE } from "@/lib/constants/site";

const CONTACT_DETAILS = [
  { icon: MapPin, label: "Campus Address", value: SITE.location },
  { icon: Phone, label: "Phone", value: "+250 788 000 000" },
  { icon: Mail, label: "Email", value: "info@skaffacademy.rw" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Contact Us</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Reach out to the campus office for admissions or general inquiries.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
    </div>
  );
}
