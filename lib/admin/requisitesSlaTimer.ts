/** Окно 15 минут для ориентира админа (отсчёт с первого открытия чата в этой сессии браузера). */
export const ADMIN_REQUISITES_SLA_MS = 15 * 60 * 1000;

const storageKey = (userId: string) => `evfa-admin-requisites-sla:${userId}`;

export function getRequisitesSlaStartedAt(userId: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(storageKey(userId));
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Записывает момент старта, если ещё не было — для страницы чата. */
export function ensureRequisitesSlaStarted(userId: string): number {
  const existing = getRequisitesSlaStartedAt(userId);
  if (existing != null) return existing;
  const now = Date.now();
  sessionStorage.setItem(storageKey(userId), String(now));
  return now;
}

export function getRequisitesSlaRemainingMs(startedAt: number, nowMs: number): number {
  return Math.max(0, ADMIN_REQUISITES_SLA_MS - (nowMs - startedAt));
}

export function formatRequisitesSlaClock(remainingMs: number): string {
  const totalSec = Math.ceil(remainingMs / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
