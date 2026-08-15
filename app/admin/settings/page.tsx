import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Campus system configuration." />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming soon</CardTitle>
          <CardDescription>
            Institution settings, staff accounts, and system preferences will be configurable
            here.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
