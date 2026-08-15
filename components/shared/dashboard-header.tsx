"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Bell, LogOut, Settings, UserRound } from "lucide-react";
import { AppLogo } from "@/components/shared/app-logo";
import { DashboardNav } from "@/components/shared/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavItem } from "@/lib/constants/navigation";

interface DashboardHeaderProps {
  navItems: NavItem[];
  basePath: string;
  portalLabel: string;
  userName: string;
  userSubtitle?: string;
  profileHref: string;
  settingsHref?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardHeader({
  navItems,
  basePath,
  portalLabel,
  userName,
  userSubtitle,
  profileHref,
  settingsHref,
}: DashboardHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white px-4 sm:px-6">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle asChild>
              <AppLogo variant="on-dark" href={basePath} />
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-sidebar-foreground/50 uppercase">
            {portalLabel}
          </div>
          <div className="px-3 py-2">
            <DashboardNav
              navItems={navItems}
              basePath={basePath}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="size-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-foreground">{userName}</span>
              {userSubtitle && (
                <span className="block text-xs text-muted-foreground">{userSubtitle}</span>
              )}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={profileHref}>
              <UserRound className="size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          {settingsHref && (
            <DropdownMenuItem asChild>
              <Link href={settingsHref}>
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild variant="destructive">
            <Link href="/">
              <LogOut className="size-4" />
              Log out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
