import type { UserDashboardProfile } from "@/types/dashboard";
import {
  applicationStatusBadgeClass,
  applicationStatusLabel,
} from "@/lib/dashboard/statusLabels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  profile: UserDashboardProfile | null;
  loading: boolean;
  onLogout: () => void;
}

export function DashboardSidebar({ profile, loading, onLogout }: DashboardSidebarProps) {
  return (
    <aside className="flex max-h-[40vh] shrink-0 flex-col gap-4 overflow-y-auto border-b border-[color:var(--border)] bg-white p-4 md:max-h-none md:h-full md:w-72 md:shrink-0 md:border-b-0 md:border-r md:py-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Заявитель
        </p>
        {loading ? (
          <div className="mt-2 h-6 w-40 animate-pulse rounded bg-[color:var(--border)]" />
        ) : (
          <p className="mt-1 font-serif text-lg font-semibold text-[color:var(--foreground)]">
            {profile?.displayName ?? "—"}
          </p>
        )}
        {!loading && profile?.email && (
          <p className="mt-0.5 text-xs text-[color:var(--muted)]">{profile.email}</p>
        )}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Статус заявки
        </p>
        {loading ? (
          <div className="mt-2 h-7 w-36 animate-pulse rounded-md bg-[color:var(--border)]" />
        ) : (
          <span
            className={cn(
              "mt-2 inline-flex rounded-md border px-2.5 py-1 text-xs font-medium",
              applicationStatusBadgeClass(profile?.applicationStatus ?? "submitted")
            )}
          >
            {applicationStatusLabel(profile?.applicationStatus ?? "submitted")}
          </span>
        )}
      </div>
      <div className="mt-auto border-t border-[color:var(--border)] pt-4">
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={onLogout}>
          Выйти
        </Button>
      </div>
    </aside>
  );
}
