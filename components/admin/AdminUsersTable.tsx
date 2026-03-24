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
import { db } from "@/lib/firebase/client";
import type { ApplicationStatus } from "@/types/dashboard";
import {
  applicationStatusLabel,
  parseApplicationStatus,
} from "@/lib/dashboard/statusLabels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "approved",
  "rejected",
];

export interface AdminUserRow {
  id: string;
  displayName: string;
  email: string;
  applicationStatus: ApplicationStatus;
  role: string;
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
  };
}

export function AdminUsersTable() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
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
      await updateDoc(doc(db, "users", uid), { applicationStatus: status });
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[rgba(184,137,26,0.25)] bg-[rgba(8,18,38,0.85)]">
      <div className="shrink-0 border-b border-[rgba(184,137,26,0.2)] px-4 py-3">
        <h1 className="font-serif text-xl font-semibold text-[#F5F0E8] md:text-2xl">
          Пользователи
        </h1>
        <p className="mt-1 text-sm text-[rgba(245,240,232,0.45)]">
          Заявители и статусы заявок. Чат открывается по кнопке.
        </p>
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
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 z-[1] bg-[rgba(8,18,38,0.98)] shadow-[0_1px_0_rgba(184,137,26,0.15)]">
              <tr className="border-b border-[rgba(184,137,26,0.15)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgba(245,240,232,0.45)]">
                <th className="px-4 py-3 font-medium">Имя</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
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
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {applicationStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                    {rowErrors[row.id] && (
                      <p className="mt-1 text-xs text-red-400">{rowErrors[row.id]}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/admin/users/${row.id}`}>Открыть чат</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
