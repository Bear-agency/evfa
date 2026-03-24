"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function isFullViewportRoute(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const full = isFullViewportRoute(pathname);

  if (full) {
    return (
      <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
