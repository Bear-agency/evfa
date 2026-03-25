"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2FormValues } from "@/lib/validations/step2";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { allCountries, countryPhoneCodes } from "@/lib/constants/countries";

interface Step2ApplicantInfoProps {
  defaultValues?: Partial<Step2FormValues>;
  onBack: () => void;
  onNext: (data: Step2FormValues) => void;
}

export function Step2ApplicantInfo({
  defaultValues,
  onBack,
  onNext,
}: Step2ApplicantInfoProps) {
  const [smsSent, setSmsSent] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [smsSendError, setSmsSendError] = useState<string | null>(null);
  const [smsVerified, setSmsVerified] = useState(false);
  const [smsVerifyLoading, setSmsVerifyLoading] = useState(false);
  const [smsVerifyError, setSmsVerifyError] = useState<string | null>(null);

  const [codeDigits, setCodeDigits] = useState<string[]>(["", "", "", ""]);

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema) as Resolver<Step2FormValues>,
    defaultValues: {
      birthDate: "",
      citizenship: "",
      residenceCountry: "",
      taxResidency: "",
      phone: "",
      hasSecondCitizenship: false,
      secondCitizenship: "",
      hasResidencePermit: false,
      residencePermitCountry: "",
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<Step2FormValues> = (data) => {
    if (!smsVerified) {
      setSmsVerifyError("Сначала подтвердите номер телефона кодом из SMS.");
      return;
    }
    onNext(data);
  };

  const sendSmsCode = async () => {
    setSmsSendError(null);
    setSmsVerifyError(null);
    setSmsVerified(false);
    if (smsSending) return;

    // Валидация телефона перед отправкой SMS.
    const isPhoneOk = await form.trigger("phone");
    if (!isPhoneOk) return;

    const phone = form.getValues("phone");
    if (!phone) return;
    setSmsSending(true);
    try {
      const res = await fetch("/api/smsaero/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Не удалось отправить SMS-код.");
      }

      setSmsSent(true);
      setCodeDigits(["", "", "", ""]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Не удалось отправить SMS-код.";
      setSmsSendError(msg);
    } finally {
      setSmsSending(false);
    }
  };

  const enteredCode = codeDigits.join("");

  const verifySmsCode = async () => {
    setSmsVerifyError(null);
    if (smsVerifyLoading) return;
    if (!enteredCode || enteredCode.length !== 4) {
      setSmsVerifyError("Введите 4-значный код.");
      return;
    }

    const phone = form.getValues("phone");
    if (!phone) {
      setSmsVerifyError("Некорректный номер телефона. Отправьте код заново.");
      return;
    }

    setSmsVerifyLoading(true);
    try {
      const res = await fetch("/api/smsaero/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: enteredCode }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Не удалось подтвердить код.");
      }

      setSmsVerified(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Не удалось подтвердить код.";
      setSmsVerifyError(msg);
    } finally {
      setSmsVerifyLoading(false);
    }
  };

  const countryOptions = allCountries;

  const phoneCodeOptions = Array.from(
    new Set(
      countryOptions
        .map((c) => countryPhoneCodes[c.code])
        .filter((code): code is string => Boolean(code))
    )
  )
    .sort((a, b) => a.localeCompare(b))
    .map((code) => ({
      code,
      label: code,
    }));

  const [phoneCode, setPhoneCode] = useState<string>(
    phoneCodeOptions[0]?.code ?? "+49"
  );
  const [phoneLocal, setPhoneLocal] = useState<string>("");

  const updatePhoneValue = (newCode: string, local: string) => {
    const digits = local.replace(/\D/g, "");
    const value = digits ? `${newCode}${digits}` : "";
    form.setValue("phone", value);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-label="Данные заявителя"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Дата рождения</Label>
          <Input
            id="birthDate"
            type="date"
            {...form.register("birthDate")}
            aria-invalid={!!form.formState.errors.birthDate}
            aria-describedby={
              form.formState.errors.birthDate ? "birthDate-error" : undefined
            }
          />
          {form.formState.errors.birthDate && (
            <p id="birthDate-error" className="text-xs text-red-600">
              {form.formState.errors.birthDate.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="citizenship">Гражданство</Label>
          <select
            id="citizenship"
            className="h-10 w-full rounded-md border border-[color:var(--border)] bg-white px-3 text-sm"
            {...form.register("citizenship")}
            aria-invalid={!!form.formState.errors.citizenship}
            aria-describedby={
              form.formState.errors.citizenship ? "citizenship-error" : undefined
            }
          >
            <option value="">Выберите страну</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.nameRu}
              </option>
            ))}
          </select>
          {form.formState.errors.citizenship && (
            <p id="citizenship-error" className="text-xs text-red-600">
              {form.formState.errors.citizenship.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="residenceCountry">Страна проживания</Label>
          <select
            id="residenceCountry"
            className="h-10 w-full rounded-md border border-[color:var(--border)] bg-white px-3 text-sm"
            {...form.register("residenceCountry")}
            aria-invalid={!!form.formState.errors.residenceCountry}
            aria-describedby={
              form.formState.errors.residenceCountry ? "residenceCountry-error" : undefined
            }
          >
            <option value="">Выберите страну</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.nameRu}
              </option>
            ))}
          </select>
          {form.formState.errors.residenceCountry && (
            <p id="residenceCountry-error" className="text-xs text-red-600">
              {form.formState.errors.residenceCountry.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="taxResidency">Налоговое резидентство</Label>
          <select
            id="taxResidency"
            className="h-10 w-full rounded-md border border-[color:var(--border)] bg-white px-3 text-sm"
            {...form.register("taxResidency")}
            aria-invalid={!!form.formState.errors.taxResidency}
            aria-describedby={
              form.formState.errors.taxResidency ? "taxResidency-error" : undefined
            }
          >
            <option value="">Выберите страну</option>
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.nameRu}
              </option>
            ))}
          </select>
          {form.formState.errors.taxResidency && (
            <p id="taxResidency-error" className="text-xs text-red-600">
              {form.formState.errors.taxResidency.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Номер телефона (с кодом страны)</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-[2]">
            <div className="w-28">
              <select
                className="h-10 w-full rounded-md border border-[color:var(--border)] bg-white px-2 text-sm"
                value={phoneCode}
                onChange={(e) => {
                  const newCode = e.target.value;
                  setPhoneCode(newCode);
                  updatePhoneValue(newCode, phoneLocal);
                }}
                aria-label="Код страны"
              >
                {phoneCodeOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Input
                id="phone"
                placeholder="9123456789"
                value={phoneLocal}
                onChange={(e) => {
                  const local = e.target.value;
                  setPhoneLocal(local);
                  updatePhoneValue(phoneCode, local);
                }}
                aria-invalid={!!form.formState.errors.phone}
                aria-describedby={
                  form.formState.errors.phone ? "phone-error" : undefined
                }
              />
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="shrink-0"
            onClick={sendSmsCode}
            disabled={smsSending}
          >
            {smsSending ? "Отправка…" : "Отправить код"}
          </Button>
        </div>
        {form.formState.errors.phone && (
          <p id="phone-error" className="text-xs text-red-600">
            {form.formState.errors.phone.message}
          </p>
        )}
        {smsSendError && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {smsSendError}
          </p>
        )}
        {smsSent && (
          <div className="mt-2 flex flex-col gap-1 text-xs">
            <span className="text-emerald-700">
              Код отправлен. Введите 4-значный код для подтверждения.
            </span>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Input
                  key={idx}
                  className="h-9 w-10 text-center"
                  maxLength={1}
                  inputMode="numeric"
                  aria-label={`Символ ${idx + 1} кода`}
                  value={codeDigits[idx] ?? ""}
                  onChange={(e) => {
                    const digit = e.target.value.replace(/\D/g, "");
                    setCodeDigits((prev) => {
                      const next = [...prev];
                      next[idx] = digit.slice(-1);
                      return next;
                    });
                  }}
                />
              ))}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={verifySmsCode}
                disabled={smsVerifyLoading || enteredCode.length !== 4}
              >
                {smsVerifyLoading ? "Проверка…" : "Подтвердить код"}
              </Button>
              {smsVerified && (
                <span className="text-emerald-800">Номер подтверждён.</span>
              )}
            </div>

            {smsVerifyError && (
              <p className="mt-1 text-xs text-red-600" role="alert">
                {smsVerifyError}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[rgba(248,249,252,0.8)] p-3 text-xs">
          <div className="flex items-start gap-2">
            <Checkbox
              id="hasSecondCitizenship"
              checked={form.watch("hasSecondCitizenship")}
              onCheckedChange={(v) =>
                form.setValue("hasSecondCitizenship", v === true)
              }
            />
            <Label htmlFor="hasSecondCitizenship" className="font-normal">
              Есть ли второе гражданство
            </Label>
          </div>
          {form.watch("hasSecondCitizenship") && (
            <div className="mt-2 space-y-1.5">
              <Label htmlFor="secondCitizenship">Страна второго гражданства</Label>
              <select
                id="secondCitizenship"
                className="h-9 w-full rounded-md border border-[color:var(--border)] bg-white px-2 text-xs"
                {...form.register("secondCitizenship")}
                aria-invalid={!!form.formState.errors.secondCitizenship}
                aria-describedby={
                  form.formState.errors.secondCitizenship
                    ? "secondCitizenship-error"
                    : undefined
                }
              >
                <option value="">Выберите страну</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameRu}
                  </option>
                ))}
              </select>
              {form.formState.errors.secondCitizenship && (
                <p id="secondCitizenship-error" className="text-xs text-red-600">
                  {form.formState.errors.secondCitizenship.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[rgba(248,249,252,0.8)] p-3 text-xs">
          <div className="flex items-start gap-2">
            <Checkbox
              id="hasResidencePermit"
              checked={form.watch("hasResidencePermit")}
              onCheckedChange={(v) =>
                form.setValue("hasResidencePermit", v === true)
              }
            />
            <Label htmlFor="hasResidencePermit" className="font-normal">
              Есть ли ВНЖ в другой стране
            </Label>
          </div>
          {form.watch("hasResidencePermit") && (
            <div className="mt-2 space-y-1.5">
              <Label htmlFor="residencePermitCountry">Страна ВНЖ</Label>
              <select
                id="residencePermitCountry"
                className="h-9 w-full rounded-md border border-[color:var(--border)] bg-white px-2 text-xs"
                {...form.register("residencePermitCountry")}
                aria-invalid={!!form.formState.errors.residencePermitCountry}
                aria-describedby={
                  form.formState.errors.residencePermitCountry
                    ? "residencePermitCountry-error"
                    : undefined
                }
              >
                <option value="">Выберите страну</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.nameRu}
                  </option>
                ))}
              </select>
              {form.formState.errors.residencePermitCountry && (
                <p id="residencePermitCountry-error" className="text-xs text-red-600">
                  {form.formState.errors.residencePermitCountry.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button
          type="submit"
          disabled={!smsSent || !smsVerified}
          title={!smsSent ? "Сначала отправьте код" : undefined}
        >
          Продолжить
        </Button>
      </div>
    </form>
  );
}

