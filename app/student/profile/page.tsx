import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";

export default async function StudentProfilePage() {
  const students = await studentService.listStudents();
  const student = students[0];
  const user = student ? await studentService.getUserForStudent(student.id) : undefined;
  const program = student ? await courseService.getProgram(student.programId) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your personal and enrollment information." />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Full Name</p>
            <p className="text-sm font-medium text-foreground">{user?.fullName ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium text-foreground">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium text-foreground">{user?.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Student Number</p>
            <p className="text-sm font-medium text-foreground">{student?.studentNumber ?? "—"}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrollment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Program</p>
            <p className="text-sm font-medium text-foreground">{program?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            {student && <StatusBadge status={student.status} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
