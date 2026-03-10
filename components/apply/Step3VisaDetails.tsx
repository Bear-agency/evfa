"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, type Step3FormValues, visaTypes } from "@/lib/validations/step3";
import { euCountriesRu } from "@/lib/constants/countries";
import { visaRequirements } from "@/lib/constants/visaRequirements";
import type { VisaType } from "@/types/apply";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Step3VisaDetailsProps {
  defaultValues?: Partial<Step3FormValues>;
  onBack: () => void;
  onNext: (data: Step3FormValues) => void;
}

export function Step3VisaDetails({
  defaultValues,
  onBack,
  onNext,
}: Step3VisaDetailsProps) {
  const form = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      destinationCountry: "",
      visaType: "" as VisaType,
      ...defaultValues,
    },
  });

  const onSubmit = (data: Step3FormValues) => {
    console.log("Step3 submit", data);
    onNext(data);
  };

  const selectedVisa = form.watch("visaType") as VisaType | "";
  const req =
    selectedVisa && selectedVisa in visaRequirements
      ? visaRequirements[selectedVisa as VisaType]
      : null;

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-label="Параметры визы"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="destinationCountry">Страна назначения</Label>
          <select
            id="destinationCountry"
            className="h-10 w-full rounded-md border border-[color:var(--border)] bg-white px-3 text-sm"
            {...form.register("destinationCountry")}
            aria-invalid={!!form.formState.errors.destinationCountry}
            aria-describedby={
              form.formState.errors.destinationCountry
                ? "destinationCountry-error"
                : undefined
            }
          >
            <option value="">Выберите страну ЕС</option>
            {euCountriesRu.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.nameRu}
              </option>
            ))}
          </select>
          {form.formState.errors.destinationCountry && (
            <p id="destinationCountry-error" className="text-xs text-red-600">
              {form.formState.errors.destinationCountry.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="visaType">Тип визы</Label>
          <select
            id="visaType"
            className="h-10 w-full rounded-md border border-[color:var(--border)] bg-white px-3 text-sm"
            {...form.register("visaType")}
            aria-invalid={!!form.formState.errors.visaType}
            aria-describedby={
              form.formState.errors.visaType ? "visaType-error" : undefined
            }
          >
            <option value="">Выберите тип</option>
            {visaTypes.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
          {form.formState.errors.visaType && (
            <p id="visaType-error" className="text-xs text-red-600">
              {form.formState.errors.visaType.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[color:var(--border)] bg-[rgba(248,249,252,0.9)] p-4 text-xs text-[color:var(--muted)]">
        {req ? (
          <>
            <p className="mb-2 font-medium text-[color:var(--foreground)]">
              Параметры финансового подтверждения (мок-данные)
            </p>
            <ul className="space-y-1">
              <li>
                ✔ Требуемая сумма подтверждения:{" "}
                <span className="font-semibold text-[color:var(--foreground)]">
                  {req.amount.toLocaleString("ru-RU")} EUR
                </span>
              </li>
              <li>
                ✔ Минимальный срок блокировки:{" "}
                <span className="font-semibold text-[color:var(--foreground)]">
                  {req.lockDays} дней
                </span>
              </li>
            </ul>
          </>
        ) : (
          <p>
            Выберите страну назначения и тип визы, чтобы увидеть требования по сумме
            подтверждения и минимальному сроку блокировки средств (мок-данные).
          </p>
        )}
      </div>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit">Продолжить</Button>
      </div>
    </form>
  );
}

