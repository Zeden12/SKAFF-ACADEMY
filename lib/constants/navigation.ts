import type { NavIconKey } from "@/components/shared/nav-icons";

export interface NavItem {
  label: string;
  href: string;
  icon?: NavIconKey;
}

export const PUBLIC_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Admissions", href: "/admissions" },
  { label: "Announcements", href: "/announcements" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: "dashboard" },
  { label: "My Course", href: "/student/course", icon: "book" },
  { label: "Materials", href: "/student/materials", icon: "folder" },
  { label: "Schedule", href: "/student/schedule", icon: "calendar" },
  { label: "Assignments", href: "/student/assignments", icon: "clipboard" },
  { label: "Results", href: "/student/results", icon: "graduation" },
  { label: "Attendance", href: "/student/attendance", icon: "check-square" },
  { label: "Fees", href: "/student/fees", icon: "wallet" },
  { label: "Documents", href: "/student/documents", icon: "file" },
  { label: "Announcements", href: "/student/announcements", icon: "megaphone" },
  { label: "Profile", href: "/student/profile", icon: "user" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Admissions", href: "/admin/admissions", icon: "clipboard-check" },
  { label: "Students", href: "/admin/students", icon: "users" },
  { label: "Courses", href: "/admin/courses", icon: "book" },
  { label: "Classes", href: "/admin/classes", icon: "layers" },
  { label: "Schedule", href: "/admin/schedule", icon: "calendar" },
  { label: "Materials", href: "/admin/materials", icon: "folder" },
  { label: "Assignments", href: "/admin/assignments", icon: "clipboard" },
  { label: "Results", href: "/admin/results", icon: "graduation" },
  { label: "Attendance", href: "/admin/attendance", icon: "check-square" },
  { label: "Fees", href: "/admin/fees", icon: "wallet" },
  { label: "Documents", href: "/admin/documents", icon: "file" },
  { label: "Announcements", href: "/admin/announcements", icon: "megaphone" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
