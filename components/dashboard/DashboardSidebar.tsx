import type { UserCabinetDisplay, UserDashboardProfile } from "@/types/dashboard";
import {
  applicationStatusBadgeClass,
  applicationStatusLabel,
} from "@/lib/dashboard/statusLabels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  profile: UserDashboardProfile | null;
  cabinet: UserCabinetDisplay | null;
  loading: boolean;
  onLogout: () => void;
}

export function DashboardSidebar({
  profile,
  cabinet,
  loading,
  onLogout,
}: DashboardSidebarProps) {
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
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Сумма и срок блокировки
        </p>
        {loading ? (
          <div className="mt-2 h-16 w-full animate-pulse rounded-md bg-[color:var(--border)]" />
        ) : (
          <div className="mt-2 space-y-2 rounded-md border border-[color:var(--border)] bg-[rgba(248,249,252,0.85)] p-3 text-xs">
            <p className="text-[color:var(--foreground)]">
              <span className="text-[color:var(--muted)]">Требуемая сумма:</span>{" "}
              {cabinet?.requiredAmountEur != null ? (
                <span className="font-semibold tabular-nums">
                  {cabinet.requiredAmountEur.toLocaleString("ru-RU")} EUR
                </span>
              ) : (
                <span className="text-[color:var(--muted)]">— (укажите тип визы в заявке)</span>
              )}
            </p>
            <p className="text-[color:var(--foreground)]">
              <span className="text-[color:var(--muted)]">Заморозка средств:</span>{" "}
              <span className="font-semibold tabular-nums">
                {cabinet?.freezeDays ?? 1} дн.
              </span>
            </p>
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Реквизиты для перечисления
        </p>
        {loading ? (
          <div className="mt-2 h-24 w-full animate-pulse rounded-md bg-[color:var(--border)]" />
        ) : cabinet?.requisitesText ? (
          <pre className="mt-2 whitespace-pre-wrap break-words rounded-md border border-[color:var(--border)] bg-white p-3 font-sans text-xs leading-relaxed text-[color:var(--foreground)]">
            {cabinet.requisitesText}
          </pre>
        ) : (
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            Реквизиты появятся здесь после того, как их добавит администратор.
          </p>
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
