"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "../actions";
import { Package, Receipt, LogOut } from "lucide-react";

type Props = {
  email: string;
  children: React.ReactNode;
};

const nav = [
  { label: "Inventory", href: "/admin", icon: Package },
  { label: "Purchases", href: "/admin/purchases", icon: Receipt },
];

export function AdminShell({ email, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-1 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-semibold text-slate-900 tracking-tight">
              ESN Porto <span className="text-slate-400 font-normal">/ merch</span>
            </Link>

            <nav className="flex items-center gap-1">
              {nav.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-medium"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:block">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
