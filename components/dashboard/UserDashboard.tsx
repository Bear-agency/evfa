"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserRole } from "@/lib/auth/userRole";
import { parseApplicationStatus } from "@/lib/dashboard/statusLabels";
import type { UserDashboardProfile } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardChat } from "@/components/dashboard/DashboardChat";

function profileFromUserData(data: Record<string, unknown>): UserDashboardProfile {
  const reg = data.registration as
    | { surname?: string; name?: string; patronymic?: string; email?: string }
    | undefined;
  const surname = reg?.surname ?? "";
  const name = reg?.name ?? "";
  const patronymic = reg?.patronymic;
  const displayName =
    [surname, name, patronymic].filter(Boolean).join(" ").trim() || "Заявитель";
  return {
    displayName,
    applicationStatus: parseApplicationStatus(data.applicationStatus),
    email: typeof reg?.email === "string" ? reg.email : null,
  };
}

export function UserDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState<UserDashboardProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      const role = await fetchUserRole(user.uid);
      if (cancelled) return;
      if (role === "admin") {
        router.replace("/admin");
        return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    const ref = doc(getDb(), "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setAccessDenied(true);
          setProfile(null);
          setProfileLoading(false);
          return;
        }
        setAccessDenied(false);
        setProfile(profileFromUserData(snap.data() as Record<string, unknown>));
        setProfileLoading(false);
      },
      () => {
        setProfileLoading(false);
      }
    );
    return () => unsub();
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-[color:var(--muted)]">
        Загрузка…
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center overflow-y-auto p-4">
        <div className="container max-w-md text-center">
        <h1 className="font-serif text-xl font-semibold text-[color:var(--foreground)]">
          Профиль не найден
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Оформите заявку, чтобы получить доступ к кабинету.
        </p>
        <Button asChild className="mt-6">
          <Link href="/apply">Подать заявку</Link>
        </Button>
        </div>
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <DashboardSidebar
        profile={profile}
        loading={profileLoading}
        onLogout={handleLogout}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DashboardChat userId={user.uid} />
      </div>
    </div>
  );
}
