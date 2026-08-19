import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StudentStatusBanner } from "@/components/student/student-status-banner";
import { STUDENT_NAV } from "@/lib/constants/navigation";
import { studentService } from "@/lib/services/student-service";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const current = await studentService.getCurrentStudent();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar navItems={STUDENT_NAV} basePath="/student" portalLabel="Student Portal" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          navItems={STUDENT_NAV}
          basePath="/student"
          portalLabel="Student Portal"
          userName={current?.user.fullName ?? "Student"}
          userSubtitle={current?.profile.studentNumber}
          profileHref="/student/profile"
        />
        <main className="flex-1 space-y-4 p-4 sm:p-6">
          {current && <StudentStatusBanner status={current.profile.status} />}
          {children}
        </main>
      </div>
    </div>
  );
}
