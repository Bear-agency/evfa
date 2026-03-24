"use client";

import { useEffect, useState, type FormEvent } from "react";
import { deleteField, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { resolveCabinetFromUserDoc } from "@/lib/dashboard/cabinetFromUserDoc";
import type { ApplicationStatus } from "@/types/dashboard";
import {
  APPLICATION_STATUS_OPTIONS,
  applicationStatusLabel,
  parseApplicationStatus,
} from "@/lib/dashboard/statusLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AdminCabinetPanelProps {
  userId: string;
  className?: string;
}

export function AdminCabinetPanel({ userId, className }: AdminCabinetPanelProps) {
  const [requisites, setRequisites] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [freezeInput, setFreezeInput] = useState("1");
  const [resolvedHint, setResolvedHint] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>("submitted");
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    setSaveOk(false);
    const ref = doc(getDb(), "users", userId);
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const raw = snap.data() as Record<string, unknown>;
      setApplicationStatus(parseApplicationStatus(raw.applicationStatus));
      const r = resolveCabinetFromUserDoc(raw);
      setRequisites(typeof raw.cabinetRequisitesText === "string" ? raw.cabinetRequisitesText : "");
      const o = raw.cabinetRequiredAmountEur;
      setAmountInput(typeof o === "number" ? String(o) : "");
      const f = raw.freezeDays;
      setFreezeInput(typeof f === "number" ? String(f) : "1");
      const amt =
        r.requiredAmountEur != null
          ? `${r.requiredAmountEur.toLocaleString("ru-RU")} EUR`
          : "сумма из заявки не задана";
      setResolvedHint(`В кабинете: ${amt}, заморозка ${r.freezeDays} дн.`);
    });
    return () => unsub();
  }, [userId]);

  async function handleApplicationStatusChange(next: ApplicationStatus) {
    if (next === applicationStatus) return;
    setStatusError(null);
    setStatusSaving(true);
    try {
      await updateDoc(doc(getDb(), "users", userId), {
        applicationStatus: next,
      });
    } catch {
      setStatusError("Не удалось сохранить статус.");
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveOk(false);
    setSaving(true);
    try {
      const freeze = Math.min(365, Math.max(1, Math.floor(Number(freezeInput) || 1)));
      const trimmedReq = requisites.trim();

      const payload: Record<string, unknown> = {
        cabinetRequisitesText: trimmedReq,
        freezeDays: freeze,
      };

      const rawAmt = amountInput.trim().replace(/\s/g, "").replace(",", ".");
      if (rawAmt === "") {
        payload.cabinetRequiredAmountEur = deleteField();
      } else {
        const n = Number(rawAmt);
        if (!Number.isFinite(n) || n <= 0) {
          setSaveError("Введите положительную сумму в EUR или оставьте поле пустым (брать из заявки).");
          setSaving(false);
          return;
        }
        payload.cabinetRequiredAmountEur = Math.round(n * 100) / 100;
      }

      await updateDoc(doc(getDb(), "users", userId), payload);
      setSaveOk(true);
    } catch {
      setSaveError("Не удалось сохранить. Проверьте правила Firestore для администратора.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-[rgba(184,137,26,0.25)] bg-[rgba(8,18,38,0.85)]",
        className
      )}
    >
      <div className="shrink-0 border-b border-[rgba(184,137,26,0.2)] px-4 py-3">
        <h2 className="font-serif text-base font-semibold text-[#F5F0E8]">
          Данные в кабинете заявителя
        </h2>
        <div className="mt-3 space-y-1.5">
          <Label
            htmlFor={`app-status-${userId}`}
            className="text-[rgba(245,240,232,0.75)]"
          >
            Статус заявки
          </Label>
          <select
            id={`app-status-${userId}`}
            className={cn(
              "w-full rounded-md border border-[rgba(184,137,26,0.35)] bg-[rgba(10,20,40,0.9)] px-3 py-2 text-sm text-[#F5F0E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,137,26,0.45)]",
              statusSaving && "opacity-60"
            )}
            value={applicationStatus}
            disabled={statusSaving}
            onChange={(e) =>
              handleApplicationStatusChange(e.target.value as ApplicationStatus)
            }
            aria-label="Статус заявки"
          >
            {APPLICATION_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {applicationStatusLabel(s)}
              </option>
            ))}
          </select>
          {statusError && (
            <p className="text-xs text-red-400" role="alert">
              {statusError}
            </p>
          )}
        </div>
        <p className="mt-3 text-xs text-[rgba(245,240,232,0.45)]">
          Реквизиты и сумма отображаются в личном кабинете. Пустая сумма — брать из типа визы в заявке.
        </p>
        {resolvedHint && (
          <p className="mt-2 text-xs text-[rgba(245,240,232,0.55)]">{resolvedHint}</p>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor={`cabinet-req-${userId}`} className="text-[rgba(245,240,232,0.75)]">
            Реквизиты (текст для кабинета)
          </Label>
          <textarea
            id={`cabinet-req-${userId}`}
            value={requisites}
            onChange={(e) => setRequisites(e.target.value)}
            rows={6}
            maxLength={8000}
            placeholder="Получатель, IBAN, банк, назначение платежа…"
            className="w-full resize-y rounded-md border border-[rgba(184,137,26,0.35)] bg-[rgba(10,20,40,0.9)] px-3 py-2 text-sm text-[#F5F0E8] placeholder:text-[rgba(245,240,232,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(184,137,26,0.45)]"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`cabinet-amt-${userId}`} className="text-[rgba(245,240,232,0.75)]">
              Сумма подтверждения (EUR)
            </Label>
            <Input
              id={`cabinet-amt-${userId}`}
              type="text"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Пусто = из заявки"
              className="border-[rgba(184,137,26,0.35)] bg-[rgba(10,20,40,0.9)] text-[#F5F0E8] ring-offset-[rgba(8,18,38,0.95)] placeholder:text-[rgba(245,240,232,0.35)] focus-visible:ring-[rgba(184,137,26,0.45)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cabinet-frz-${userId}`} className="text-[rgba(245,240,232,0.75)]">
              Заморозка (дней)
            </Label>
            <Input
              id={`cabinet-frz-${userId}`}
              type="number"
              min={1}
              max={365}
              value={freezeInput}
              onChange={(e) => setFreezeInput(e.target.value)}
              className="border-[rgba(184,137,26,0.35)] bg-[rgba(10,20,40,0.9)] text-[#F5F0E8] ring-offset-[rgba(8,18,38,0.95)] focus-visible:ring-[rgba(184,137,26,0.45)]"
            />
          </div>
        </div>
        {saveError && (
          <p className="text-xs text-red-400" role="alert">
            {saveError}
          </p>
        )}
        {saveOk && (
          <p className="text-xs text-emerald-400">Сохранено.</p>
        )}
        <Button
          type="submit"
          variant="adminPanel"
          className="w-full sm:w-auto"
          disabled={saving}
        >
          {saving ? "Сохранение…" : "Сохранить в кабинет"}
        </Button>
      </form>
    </section>
  );
}
