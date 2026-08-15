import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { ADMIN_NAV } from "@/lib/constants/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar navItems={ADMIN_NAV} basePath="/admin" portalLabel="Admin Portal" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          navItems={ADMIN_NAV}
          basePath="/admin"
          portalLabel="Admin Portal"
          userName="Staff Member"
          userSubtitle="Administrator"
          profileHref="/admin/settings"
          settingsHref="/admin/settings"
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
