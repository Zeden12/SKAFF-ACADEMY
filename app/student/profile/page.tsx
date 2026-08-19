import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { formatDate } from "@/lib/utils";
import { ContactForm } from "./contact-form";

export default async function StudentProfilePage() {
  const current = await studentService.getCurrentStudent();
  if (!current) {
    return <PageHeader title="Profile" description="No student account found." />;
  }
  const { profile: student, user } = current;

  const [program, intake] = await Promise.all([
    courseService.getProgram(student.programId),
    courseService.getIntake(student.intakeId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your personal and enrollment information." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
          <CardDescription>
            These details are managed by the Academy office. Contact administration to request a change.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Full Name" value={user.fullName} />
          <ReadOnlyField label="Student Number" value={student.studentNumber} />
          <ReadOnlyField label="Email" value={user.email} />
          <ReadOnlyField label="Date of Birth" value={student.dateOfBirth ? formatDate(student.dateOfBirth) : "—"} />
          <ReadOnlyField label="Nationality" value={student.nationality ?? "—"} />
          <ReadOnlyField label="National ID" value={student.nationalId ?? "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
          <CardDescription>Keep this up to date so the Academy can reach you.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm
            initialPhone={user.phone ?? ""}
            initialAddress={student.address ?? ""}
            initialEmergencyContactName={student.emergencyContactName ?? ""}
            initialEmergencyContactPhone={student.emergencyContactPhone ?? ""}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrollment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Program" value={program?.name ?? "—"} />
          <ReadOnlyField label="Intake" value={intake?.label ?? "—"} />
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="mt-1">
              <StatusBadge status={student.status} />
            </div>
          </div>
          <ReadOnlyField label="Enrolled Since" value={formatDate(student.enrolledAt)} />
        </CardContent>
      </Card>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
