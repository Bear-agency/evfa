"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserRole } from "@/lib/auth/userRole";

const navItems = [
  { href: "/#about", label: "О сервисе" },
  { href: "/#countries", label: "Страны" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const isApplyPage = pathname === "/apply";
  const isAuthPage = pathname === "/login" || pathname === "/admin-login";
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    fetchUserRole(user.uid).then((role) => {
      if (!cancelled) setIsAdmin(role === "admin");
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const showApplyCta = !user || !isAdmin || isApplyPage;

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[rgba(248,249,252,0.96)] backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--border)] bg-white shadow-sm">
            <span className="font-serif text-lg font-semibold text-[color:var(--primary)]">
              EV
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-[0.18em] text-[color:var(--primary)]">
              EVFA
            </span>
            <span className="text-xs text-[color:var(--muted)]">
              European Visa Financial Authority
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!authLoading && !user && !isAuthPage && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Войти</Link>
            </Button>
          )}
          {!authLoading && user && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Кабинет</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[color:var(--muted)]"
                onClick={async () => {
                  await logout();
                  router.push("/");
                }}
              >
                Выйти
              </Button>
            </>
          )}
          {showApplyCta && (
            <Button
              asChild
              variant={isApplyPage ? "secondary" : "accent"}
              size="sm"
              className={
                isApplyPage
                  ? ""
                  : "px-4 font-semibold uppercase tracking-[0.08em] shadow-[0_8px_20px_rgba(200,151,31,0.35)]"
              }
            >
              <Link href={isApplyPage ? "/" : "/apply"}>
                {isApplyPage ? "На главную" : "Подать заявку"}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {!authLoading && !user && !isAuthPage && (
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/login">Войти</Link>
            </Button>
          )}
          {showApplyCta && (
            <Button
              asChild
              variant={isApplyPage ? "secondary" : "accent"}
              size="sm"
              className="px-4 font-semibold"
            >
              <Link href={isApplyPage ? "/" : "/apply"}>
                {isApplyPage ? "На главную" : "Подать заявку"}
              </Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-10 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium text-[color:var(--foreground)]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {!authLoading && user && (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-[color:var(--foreground)]"
                      onClick={() => setOpen(false)}
                    >
                      Личный кабинет
                    </Link>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={async () => {
                        await logout();
                        setOpen(false);
                        router.push("/");
                      }}
                    >
                      Выйти
                    </Button>
                  </>
                )}
                {!authLoading && !user && (
                  <Link
                    href="/login"
                    className="text-sm font-medium text-[color:var(--primary)]"
                    onClick={() => setOpen(false)}
                  >
                    Войти
                  </Link>
                )}
                {showApplyCta && (
                  <Button
                    asChild
                    className="mt-2 w-full"
                    variant={isApplyPage ? "secondary" : "accent"}
                  >
                    <Link
                      href={isApplyPage ? "/" : "/apply"}
                      onClick={() => setOpen(false)}
                    >
                      {isApplyPage ? "На главную" : "Подать заявку"}
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
