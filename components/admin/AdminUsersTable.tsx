"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import {
  formatRequisitesSlaClock,
  getRequisitesSlaRemainingMs,
  getRequisitesSlaStartedAt,
} from "@/lib/admin/requisitesSlaTimer";
import type { ApplicationStatus } from "@/types/dashboard";
import {
  APPLICATION_STATUS_OPTIONS,
  applicationStatusLabel,
  parseApplicationStatus,
} from "@/lib/dashboard/statusLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AdminUserRow {
  id: string;
  displayName: string;
  email: string;
  applicationStatus: ApplicationStatus;
  role: string;
  createdAt: Date | null;
  lastChatActivityAt: Date | null;
}

type AdminUsersSortKey =
  | "displayName"
  | "email"
  | "applicationStatus"
  | "slaRemaining"
  | "lastChatActivityAt"
  | "createdAt";

type SortDir = "asc" | "desc";

function parseFirestoreDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    try {
      const d = (value as { toDate: () => Date }).toDate();
      return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
    } catch {
      return null;
    }
  }
  return null;
}

function formatLastChatActivity(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function defaultSortDir(key: AdminUsersSortKey): SortDir {
  if (key === "createdAt" || key === "lastChatActivityAt") return "desc";
  if (key === "slaRemaining") return "asc";
  return "asc";
}

function slaSortValue(userId: string, nowMs: number): number {
  const started = getRequisitesSlaStartedAt(userId);
  if (started == null) return Number.POSITIVE_INFINITY;
  return getRequisitesSlaRemainingMs(started, nowMs);
}

function compareRows(
  a: AdminUserRow,
  b: AdminUserRow,
  key: AdminUsersSortKey,
  dir: SortDir,
  nowMs: number
): number {
  const sign = dir === "asc" ? 1 : -1;
  let raw = 0;
  switch (key) {
    case "displayName":
      raw = a.displayName.localeCompare(b.displayName, "ru", { sensitivity: "base" });
      break;
    case "email":
      raw = a.email.localeCompare(b.email, "ru", { sensitivity: "base" });
      break;
    case "applicationStatus": {
      const ia = APPLICATION_STATUS_OPTIONS.indexOf(a.applicationStatus);
      const ib = APPLICATION_STATUS_OPTIONS.indexOf(b.applicationStatus);
      raw = ia - ib;
      break;
    }
    case "slaRemaining":
      raw = slaSortValue(a.id, nowMs) - slaSortValue(b.id, nowMs);
      break;
    case "lastChatActivityAt": {
      const ta = a.lastChatActivityAt?.getTime() ?? -Infinity;
      const tb = b.lastChatActivityAt?.getTime() ?? -Infinity;
      raw = ta - tb;
      break;
    }
    case "createdAt": {
      const ta = a.createdAt?.getTime() ?? -Infinity;
      const tb = b.createdAt?.getTime() ?? -Infinity;
      raw = ta - tb;
      break;
    }
    default:
      break;
  }
  if (raw !== 0) return sign * raw;
  return a.id.localeCompare(b.id);
}

function rowFromDoc(id: string, data: Record<string, unknown>): AdminUserRow | null {
  const role = typeof data.role === "string" ? data.role : "user";
  if (role === "admin") return null;
  const reg = data.registration as
    | { surname?: string; name?: string; patronymic?: string; email?: string }
    | undefined;
  const surname = reg?.surname ?? "";
  const name = reg?.name ?? "";
  const patronymic = reg?.patronymic;
  const displayName =
    [surname, name, patronymic].filter(Boolean).join(" ").trim() || "—";
  const email = typeof reg?.email === "string" ? reg.email : "—";
  return {
    id,
    displayName,
    email,
    applicationStatus: parseApplicationStatus(data.applicationStatus),
    role,
    createdAt: parseFirestoreDate(data.createdAt),
    lastChatActivityAt: parseFirestoreDate(data.lastChatActivityAt),
  };
}

function normalizeSearch(s: string) {
  return s.trim().toLowerCase();
}

function AdminRequisitesSlaCell({
  userId,
  clockTick,
}: {
  userId: string;
  clockTick: number;
}) {
  void clockTick;
  const startedAt = getRequisitesSlaStartedAt(userId);
  const notStarted = startedAt == null;
  const remaining = notStarted ? 0 : getRequisitesSlaRemainingMs(startedAt, Date.now());
  const expired = !notStarted && remaining <= 0;
  const display = notStarted ? "—" : formatRequisitesSlaClock(expired ? 0 : remaining);
  return (
    <span
      className={cn(
        "tabular-nums text-xs",
        notStarted && "text-[rgba(245,240,232,0.35)]",
        !notStarted && !expired && "text-[rgba(245,240,232,0.95)]",
        expired && "text-amber-400"
      )}
      title={
        notStarted
          ? "Откройте чат с этим пользователем — начнётся отсчёт 15 минут (та же метка, что в чате)."
          : "Остаток окна 15 минут с момента первого открытия чата в этой сессии браузера."
      }
    >
      {display}
    </span>
  );
}

function SortableTh({
  label,
  columnKey,
  activeKey,
  dir,
  onSort,
  className,
}: {
  label: string;
  columnKey: AdminUsersSortKey;
  activeKey: AdminUsersSortKey;
  dir: SortDir;
  onSort: (key: AdminUsersSortKey) => void;
  className?: string;
}) {
  const active = activeKey === columnKey;
  return (
    <th scope="col" className={cn("px-4 py-3 font-medium", className)}>
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={cn(
          "inline-flex items-center gap-1 text-left uppercase tracking-[0.1em] transition-colors hover:text-[#F5F0E8]",
          active ? "text-[#F5F0E8]" : "text-[rgba(245,240,232,0.45)]"
        )}
        aria-sort={
          active ? (dir === "asc" ? "ascending" : "descending") : "none"
        }
      >
        <span>{label}</span>
        {active ? (
          <span className="text-[10px] font-normal normal-case tracking-normal opacity-90">
            {dir === "asc" ? "↑" : "↓"}
          </span>
        ) : null}
      </button>
    </th>
  );
}

export function AdminUsersTable() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string | null>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [slaClockTick, setSlaClockTick] = useState(0);
  const [sortKey, setSortKey] = useState<AdminUsersSortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    const id = window.setInterval(() => setSlaClockTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const q = query(collection(getDb(), "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setListError(null);
        const next: AdminUserRow[] = [];
        snap.forEach((d) => {
          const row = rowFromDoc(d.id, d.data() as Record<string, unknown>);
          if (row) next.push(row);
        });
        setRows(next);
        setLoading(false);
      },
      () => {
        setListError(
          "Не удалось загрузить список. Проверьте правила Firestore (доступ администратора к коллекции users)."
        );
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  async function handleStatusChange(uid: string, status: ApplicationStatus) {
    setUpdatingId(uid);
    setRowErrors((e) => ({ ...e, [uid]: null }));
    try {
      await updateDoc(doc(getDb(), "users", uid), { applicationStatus: status });
    } catch {
      setRowErrors((e) => ({
        ...e,
        [uid]: "Не удалось сохранить статус.",
      }));
    } finally {
      setUpdatingId(null);
    }
  }

  const empty = useMemo(
    () => !loading && rows.length === 0 && !listError,
    [loading, rows.length, listError]
  );

  const filteredRows = useMemo(() => {
    const q = normalizeSearch(searchQuery);
    if (!q) return rows;
    return rows.filter((r) => {
      const statusLabel = applicationStatusLabel(r.applicationStatus).toLowerCase();
      const lastChat = formatLastChatActivity(r.lastChatActivityAt).toLowerCase();
      return (
        r.displayName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        statusLabel.includes(q) ||
        lastChat.includes(q)
      );
    });
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    const copy = [...filteredRows];
    const now = Date.now();
    copy.sort((a, b) => compareRows(a, b, sortKey, sortDir, now));
    return copy;
  }, [filteredRows, sortKey, sortDir, slaClockTick]);

  function handleSortClick(key: AdminUsersSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(defaultSortDir(key));
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[rgba(184,137,26,0.25)] bg-[rgba(8,18,38,0.85)]">
      <div className="shrink-0 border-b border-[rgba(184,137,26,0.2)] px-4 py-3">
        <h1 className="font-serif text-xl font-semibold text-[#F5F0E8] md:text-2xl">
          Пользователи
        </h1>
        <p className="mt-1 text-sm text-[rgba(245,240,232,0.45)]">
          Сортировка по заголовкам столбцов (кроме «Действия»). «Последняя переписка»
          обновляется при отправке сообщения в чате. «15 мин» — остаток окна, как в
          чате (сессия браузера).
        </p>
        {!listError && !loading && rows.length > 0 && (
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, email, UID или статусу…"
            aria-label="Поиск пользователей"
            className="mt-3 max-w-md border-[rgba(184,137,26,0.35)] bg-[rgba(10,20,40,0.9)] text-[#F5F0E8] ring-offset-[rgba(8,18,38,0.95)] placeholder:text-[rgba(245,240,232,0.35)] focus-visible:ring-[rgba(184,137,26,0.45)]"
          />
        )}
      </div>

      {listError ? (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <p className="text-sm text-red-400" role="alert">
            {listError}
          </p>
        </div>
      ) : loading ? (
        <div className="flex flex-1 items-center p-4">
          <p className="text-sm text-[rgba(245,240,232,0.5)]">Загрузка…</p>
        </div>
      ) : empty ? (
        <div className="flex flex-1 items-center p-4">
          <p className="text-sm text-[rgba(245,240,232,0.5)]">
            Пользователей пока нет.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
          {sortedRows.length === 0 ? (
            <p className="p-4 text-sm text-[rgba(245,240,232,0.55)]">
              Никого не найдено. Измените запрос поиска.
            </p>
          ) : (
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="sticky top-0 z-[1] bg-[rgba(8,18,38,0.98)] shadow-[0_1px_0_rgba(184,137,26,0.15)]">
                <tr className="border-b border-[rgba(184,137,26,0.15)] text-[10px] font-semibold">
                  <SortableTh
                    label="Имя"
                    columnKey="displayName"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortClick}
                  />
                  <SortableTh
                    label="Email"
                    columnKey="email"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortClick}
                  />
                  <SortableTh
                    label="Статус"
                    columnKey="applicationStatus"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortClick}
                  />
                  <SortableTh
                    label="Последняя переписка"
                    columnKey="lastChatActivityAt"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortClick}
                    className="whitespace-nowrap"
                  />
                  <SortableTh
                    label="15 мин"
                    columnKey="slaRemaining"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortClick}
                    className="whitespace-nowrap"
                  />
                  <SortableTh
                    label="Регистрация"
                    columnKey="createdAt"
                    activeKey={sortKey}
                    dir={sortDir}
                    onSort={handleSortClick}
                    className="whitespace-nowrap"
                  />
                  <th
                    scope="col"
                    className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(245,240,232,0.45)]"
                  >
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[rgba(184,137,26,0.08)] text-[#F5F0E8] last:border-0"
                  >
                    <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                      {row.displayName}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-[rgba(245,240,232,0.75)]">
                      {row.email}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className={cn(
                          "max-w-full rounded-sm border border-[rgba(184,137,26,0.35)] bg-[rgba(10,20,40,0.9)] px-2 py-1.5 text-xs text-[#F5F0E8]",
                          updatingId === row.id && "opacity-60"
                        )}
                        value={row.applicationStatus}
                        disabled={updatingId === row.id}
                        onChange={(e) =>
                          handleStatusChange(
                            row.id,
                            e.target.value as ApplicationStatus
                          )
                        }
                        aria-label={`Статус заявки ${row.displayName}`}
                      >
                        {APPLICATION_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {applicationStatusLabel(s)}
                          </option>
                        ))}
                      </select>
                      {rowErrors[row.id] && (
                        <p className="mt-1 text-xs text-red-400">{rowErrors[row.id]}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-xs text-[rgba(245,240,232,0.85)]">
                      <span title={row.lastChatActivityAt?.toISOString() ?? undefined}>
                        {formatLastChatActivity(row.lastChatActivityAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminRequisitesSlaCell userId={row.id} clockTick={slaClockTick} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-xs text-[rgba(245,240,232,0.65)]">
                      {formatLastChatActivity(row.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="adminPanel">
                        <Link href={`/admin/users/${row.id}`}>Открыть чат</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
