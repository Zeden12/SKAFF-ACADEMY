import Link from "next/link";
import { AppLogo } from "@/components/shared/app-logo";
import { SITE } from "@/lib/constants/site";
import { PUBLIC_NAV } from "@/lib/constants/navigation";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-navy text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <AppLogo variant="on-dark" />
            <p className="mt-3 text-sm text-slate-400">{SITE.tagline}</p>
            <p className="mt-1 text-sm text-slate-400">{SITE.location}</p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Navigate
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {year} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
