"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserRole } from "@/lib/auth/userRole";
import { safeAdminLoginRedirect } from "@/lib/auth/safeRedirect";
import { mapAuthError } from "@/lib/auth/mapAuthError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const fieldClass =
  "border-[rgba(184,137,26,0.28)] bg-[rgba(10,20,40,0.75)] text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.35)] focus-visible:ring-[rgba(184,137,26,0.45)]";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const role = await fetchUserRole(user.uid);
        if (cancelled) return;
        if (!role) {
          await signOut(firebaseAuth);
          setError("Учётная запись не найдена в системе.");
          return;
        }
        if (role !== "admin") {
          router.replace("/dashboard");
          return;
        }
        router.replace(safeAdminLoginRedirect(searchParams.get("next")));
      } catch {
        if (cancelled) return;
        await signOut(firebaseAuth);
        setError("Не удалось проверить права доступа.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router, searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[linear-gradient(135deg,#0D2B5E_0%,#0A2040_100%)] text-sm text-[rgba(245,240,232,0.55)]">
        Загрузка…
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[linear-gradient(135deg,#0D2B5E_0%,#112B5A_45%,#0A2040_100%)] py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,137,26,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,137,26,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 25%, transparent 70%)",
        }}
      />
      <div className="container relative flex justify-center px-4">
        <div
          className={cn(
            "w-full max-w-md rounded-md border border-[rgba(184,137,26,0.35)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-8",
            "bg-[rgba(8,18,38,0.92)] backdrop-blur-md"
          )}
        >
          <p className="text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-[rgba(184,137,26,0.85)]">
            EVFA
          </p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-[#F5F0E8]">
            Панель администратора
          </h1>
          <p className="mt-1 text-sm text-[rgba(245,240,232,0.45)]">
            Вход только для уполномоченных сотрудников
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-[rgba(245,240,232,0.7)]">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-[rgba(245,240,232,0.7)]">
                Пароль
              </Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-[color:var(--accent)] font-semibold text-[color:var(--foreground)] hover:opacity-95"
              disabled={submitting}
            >
              {submitting ? "Вход…" : "Войти"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[rgba(245,240,232,0.4)]">
            <Link
              href="/login"
              className="underline-offset-2 hover:text-[rgba(245,240,232,0.65)] hover:underline"
            >
              Вход для заявителей
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
