import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { STUDENT_NAV } from "@/lib/constants/navigation";
import { studentService } from "@/lib/services/student-service";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const students = await studentService.listStudents();
  const currentStudent = students[0];
  const currentUser = currentStudent
    ? await studentService.getUserForStudent(currentStudent.id)
    : undefined;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar navItems={STUDENT_NAV} basePath="/student" portalLabel="Student Portal" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          navItems={STUDENT_NAV}
          basePath="/student"
          portalLabel="Student Portal"
          userName={currentUser?.fullName ?? "Student"}
          userSubtitle={currentStudent?.studentNumber}
          profileHref="/student/profile"
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
