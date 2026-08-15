import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ADMIN_NAV } from "@/lib/constants/navigation";
import { NAV_ICONS } from "@/components/shared/nav-icons";

const QUICK_LINKS = ADMIN_NAV.filter((item) => item.href !== "/admin" && item.href !== "/admin/settings");

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Manage admissions, students, courses, and campus operations."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon ? NAV_ICONS[item.icon] : undefined;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="size-4 text-primary" />}
                    <CardTitle className="text-sm">{item.label}</CardTitle>
                  </div>
                  <CardDescription>Manage {item.label.toLowerCase()}.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
