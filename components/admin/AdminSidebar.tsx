"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Пользователи", exact: true },
];

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex max-h-[40vh] w-full shrink-0 flex-col overflow-y-auto border-b border-[rgba(184,137,26,0.2)] bg-[rgba(8,18,38,0.95)] p-4 md:max-h-none md:h-full md:w-56 md:border-b-0 md:border-r md:py-6">
      <p className="text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-[rgba(184,137,26,0.85)]">
        EVFA Admin
      </p>
      <nav className="mt-6 flex flex-col gap-1">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin" || pathname.startsWith("/admin/users")
              : item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-sm px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[rgba(184,137,26,0.15)] text-[#F5F0E8]"
                  : "text-[rgba(245,240,232,0.55)] hover:bg-[rgba(184,137,26,0.08)] hover:text-[#F5F0E8]"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2 border-t border-[rgba(184,137,26,0.15)] pt-4">
        <Link
          href="/"
          className="rounded-sm px-3 py-2 text-sm text-[rgba(245,240,232,0.55)] hover:bg-[rgba(184,137,26,0.08)] hover:text-[#F5F0E8]"
        >
          На сайт
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-sm px-3 py-2 text-left text-sm text-[rgba(245,240,232,0.55)] hover:bg-[rgba(184,137,26,0.08)] hover:text-[#F5F0E8]"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
