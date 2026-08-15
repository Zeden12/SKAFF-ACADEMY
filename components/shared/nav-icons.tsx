import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  CheckSquare,
  Wallet,
  FileText,
  Megaphone,
  UserCircle,
  ClipboardCheck,
  Users,
  Layers,
  Settings,
} from "lucide-react";

/**
 * Nav items are plain serializable data (see lib/constants/navigation.ts) so they can be
 * passed from Server Component layouts into Client Component nav renderers. Icon components
 * are functions and can't cross that boundary as props, so nav items store a string key and
 * each render site resolves it locally through this map instead.
 */
export const NAV_ICONS = {
  dashboard: LayoutDashboard,
  book: BookOpen,
  folder: FolderOpen,
  calendar: CalendarDays,
  clipboard: ClipboardList,
  graduation: GraduationCap,
  "check-square": CheckSquare,
  wallet: Wallet,
  file: FileText,
  megaphone: Megaphone,
  user: UserCircle,
  "clipboard-check": ClipboardCheck,
  users: Users,
  layers: Layers,
  settings: Settings,
} as const satisfies Record<string, LucideIcon>;

export type NavIconKey = keyof typeof NAV_ICONS;
