import { Building2, Users, ClipboardCheck, GraduationCap, Bell, Server } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SITE } from "@/lib/constants/site";
import { STAFF_ROLE_LABELS } from "@/lib/constants/student-portal";
import { courseService } from "@/lib/services/course-service";

export default async function AdminSettingsPage() {
  const staff = await courseService.listAllStaff();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Campus system configuration." />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <CardTitle className="text-base">Institution</CardTitle>
          </div>
          <CardDescription>Basic identity details shown across the public site.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Academy Name" value={SITE.name} />
          <Field label="Parent Organization" value={SITE.parentOrg} />
          <Field label="Contact Email" value={SITE.contactEmail} />
          <Field label="Contact Phone" value={SITE.contactPhone} />
          <Field label="Address / Location" value={SITE.campusAddress} />
          <Field label="Opening Hours" value={SITE.openingHours} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <CardTitle className="text-base">Staff &amp; Accounts</CardTitle>
          </div>
          <CardDescription>
            Staff records currently in the system. Account creation, roles, and permissions will
            be managed here once a real authentication backend is connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staff accounts yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {staff.map(({ profile, user }) => (
                <div key={profile.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.staffNumber} · {user.email}
                      {profile.title ? ` · ${profile.title}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.roles.map((role) => (
                      <StatusBadge key={role} status={role} tone="info" label={STAFF_ROLE_LABELS[role]} />
                    ))}
                    <StatusBadge status="active" tone="success" label="Active" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-4 text-primary" />
            <CardTitle className="text-base">Admissions Configuration</CardTitle>
          </div>
          <CardDescription>
            Application windows are configured per Intake, not globally — see{" "}
            <span className="font-medium text-foreground">Intakes</span> to open or close
            applications for a specific cohort.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Reference Number Format" value="SKA-APP-YYYY-0000" />
          <Field label="Admissions Contact" value={SITE.contactEmail} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <CardTitle className="text-base">Academic Configuration</CardTitle>
          </div>
          <CardDescription>General operational defaults — not individual Program, Intake, or Class records.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Student Number Format" value="SKF-YYYY-0000" />
          <Field label="Staff Number Format" value="SKF-STAFF-0000" />
          <Field label="Default Attendance Statuses" value="Present, Absent, Late, Excused" />
          <Field label="Default Result Grading" value="A, B, C, D, E, F, Incomplete" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Delivery channels for future outbound notifications.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <IntegrationField label="Email Notifications" />
          <IntegrationField label="SMS Notifications" />
          <IntegrationField label="In-App Notifications" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="size-4 text-primary" />
            <CardTitle className="text-base">System</CardTitle>
          </div>
          <CardDescription>Current environment and known demo limitations.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Environment" value="Frontend demo — mock in-memory data" />
          <Field label="Authentication" value="Not connected — single simulated student/admin session" />
          <Field label="Backend / Database" value="Not connected — no NestJS/PostgreSQL integration yet" />
          <Field label="File Storage" value="Not connected — documents are metadata only" />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function IntegrationField({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-foreground">{label}</span>
      <StatusBadge status="unavailable" tone="neutral" label="Not Connected" />
    </div>
  );
}
