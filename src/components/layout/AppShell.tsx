import Link from "next/link";

import { AppNav } from "@/components/layout/AppNav";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { product } from "@/config/product";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-0 max-w-md flex-col overflow-x-hidden bg-white shadow-sm sm:min-h-[100dvh] sm:border-x sm:border-slate-200">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center text-sm font-semibold tracking-tight text-slate-900"
        >
          {product.name}
        </Link>
      </header>
      <InstallPrompt />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden px-4 py-6">
        {children}
      </main>
      <AppNav />
    </div>
  );
}
