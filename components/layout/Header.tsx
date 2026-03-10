"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#about", label: "О сервисе" },
  { href: "#countries", label: "Страны" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="secondary" size="sm">
            <Link href={pathname === "/apply" ? "/" : "/apply"}>
              {pathname === "/apply" ? "На главную" : "Подать заявку"}
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="secondary" size="sm" className="px-3">
            <Link href="/apply">Подать заявку</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Меню">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-10 flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium text-[color:var(--foreground)]"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Button asChild className="mt-4 w-full" variant="accent">
                  <Link href="/apply" onClick={() => setOpen(false)}>
                    Подать заявку
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

