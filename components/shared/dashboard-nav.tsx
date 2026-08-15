"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/constants/navigation";
import { NAV_ICONS } from "@/components/shared/nav-icons";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  navItems: NavItem[];
  basePath: string;
  onNavigate?: () => void;
  className?: string;
}

export function DashboardNav({ navItems, basePath, onNavigate, className }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-0.5", className)}>
      {navItems.map((item) => {
        const isActive =
          item.href === basePath ? pathname === basePath : pathname.startsWith(item.href);
        const Icon = item.icon ? NAV_ICONS[item.icon] : undefined;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
