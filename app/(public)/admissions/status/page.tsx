import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReferenceLookupForm } from "./reference-lookup-form";

export const metadata = {
  title: "Track Your Application — SKAFF ACADEMY",
};

export default function TrackApplicationPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
        Track Your Application
      </h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Enter the reference number from your confirmation page to check your application status.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Find your application</CardTitle>
          <CardDescription>Your reference looks like SKA-APP-2026-0001.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReferenceLookupForm />
        </CardContent>
      </Card>
    </div>
  );
}
