import { AppLogo } from "@/components/shared/app-logo";
import { DashboardNav } from "@/components/shared/dashboard-nav";
import type { NavItem } from "@/lib/constants/navigation";

interface DashboardSidebarProps {
  navItems: NavItem[];
  basePath: string;
  portalLabel: string;
}

/** Persistent desktop sidebar for dashboard shells. Hidden below the lg breakpoint. */
export function DashboardSidebar({ navItems, basePath, portalLabel }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <AppLogo variant="on-dark" href={basePath} />
      </div>
      <div className="px-4 pt-4 pb-1 text-xs font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
        {portalLabel}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <DashboardNav navItems={navItems} basePath={basePath} />
      </div>
    </aside>
  );
}
