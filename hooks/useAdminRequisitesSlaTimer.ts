"use client";

import { useEffect, useState } from "react";
import {
  ensureRequisitesSlaStarted,
  formatRequisitesSlaClock,
  getRequisitesSlaRemainingMs,
  getRequisitesSlaStartedAt,
} from "@/lib/admin/requisitesSlaTimer";

export interface AdminRequisitesSlaTimerState {
  /** mm:ss или «—», если чат ещё не открывали в этой сессии. */
  display: string;
  expired: boolean;
  notStarted: boolean;
}

/**
 * @param autoStart — в чате: зафиксировать старт окна 15 мин при открытии страницы.
 * В таблице: только читать уже сохранённый старт.
 */
export function useAdminRequisitesSlaTimer(
  userId: string | undefined,
  autoStart: boolean
): AdminRequisitesSlaTimerState {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!userId) {
    return { display: "—", expired: false, notStarted: true };
  }

  const startedAt = autoStart
    ? ensureRequisitesSlaStarted(userId)
    : getRequisitesSlaStartedAt(userId);

  if (startedAt == null) {
    return { display: "—", expired: false, notStarted: true };
  }

  const remaining = getRequisitesSlaRemainingMs(startedAt, Date.now());
  const expired = remaining <= 0;
  return {
    display: formatRequisitesSlaClock(expired ? 0 : remaining),
    expired,
    notStarted: false,
  };
}
