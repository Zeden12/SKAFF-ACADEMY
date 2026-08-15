import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { studentService } from "@/lib/services/student-service";
import { courseService } from "@/lib/services/course-service";
import { announcementService } from "@/lib/services/announcement-service";

export default async function StudentDashboardPage() {
  const students = await studentService.listStudents();
  const student = students[0];
  const user = student ? await studentService.getUserForStudent(student.id) : undefined;
  const program = student ? await courseService.getProgram(student.programId) : undefined;
  const announcements = await announcementService.listAnnouncements("students");

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.fullName.split(" ")[0] ?? "Student"}`}
        description="Here's a quick overview of your enrollment."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {student && <StatusBadge status={student.status} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Program</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">{program?.name ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Student Number</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">{student?.studentNumber ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Recent Announcements</h2>
        <div className="mt-3 space-y-3">
          {announcements.slice(0, 2).map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle className="text-sm">{announcement.title}</CardTitle>
                <CardDescription>{announcement.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
