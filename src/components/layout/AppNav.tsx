"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_PATH } from "@/modules/auth/paths";
import { CLIENTS_PATH } from "@/modules/prospects/paths";

const items = [
  { href: DASHBOARD_PATH, label: "Relances" },
  { href: CLIENTS_PATH, label: "Clients" },
];

function isAppPath(pathname: string): boolean {
  return (
    pathname === DASHBOARD_PATH ||
    pathname.startsWith(`${DASHBOARD_PATH}/`) ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/follow-ups")
  );
}

export function AppNav() {
  const pathname = usePathname();

  if (!isAppPath(pathname)) {
    return (
      <div
        className="h-[env(safe-area-inset-bottom)] shrink-0"
        aria-hidden="true"
      />
    );
  }

  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 bg-white/95 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-12 items-center justify-center rounded-xl px-4 text-center text-sm font-medium ${
              active
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
