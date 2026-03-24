"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserRole } from "@/lib/auth/userRole";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      const role = await fetchUserRole(user.uid);
      if (cancelled) return;
      if (role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      setAllowed(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (authLoading || !user || allowed === null) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#0A2040] text-sm text-[rgba(245,240,232,0.55)]">
        Загрузка…
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[linear-gradient(135deg,#0D2B5E_0%,#0A2040_100%)] md:flex-row">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
