"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserRole } from "@/lib/auth/userRole";
import { safeUserLoginRedirect } from "@/lib/auth/safeRedirect";
import { mapAuthError } from "@/lib/auth/mapAuthError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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
          await signOut(getFirebaseAuth());
          setError(
            "Профиль не найден. Сначала подайте заявку на открытие счёта на сайте."
          );
          return;
        }
        if (role === "admin") {
          router.replace("/admin");
          return;
        }
        router.replace(safeUserLoginRedirect(searchParams.get("next")));
      } catch {
        if (cancelled) return;
        await signOut(getFirebaseAuth());
        setError("Не удалось загрузить профиль. Попробуйте снова.");
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
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[color:var(--background)] text-sm text-[color:var(--muted)]">
        Загрузка…
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--background)] py-12 sm:py-16">
      <div className="container flex justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-2xl font-semibold text-[color:var(--foreground)]">
            Вход
          </h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Войдите в личный кабинет заявителя
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Пароль</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Вход…" : "Войти"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
            Нет аккаунта?{" "}
            <Link
              href="/apply"
              className="font-medium text-[color:var(--primary)] underline-offset-2 hover:underline"
            >
              Подать заявку
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
            <Link href="/admin-login" className="underline-offset-2 hover:underline">
              Вход для администраторов
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
