"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1FormValues } from "@/lib/validations/step1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Step1RegistrationProps {
  defaultValues?: Partial<Step1FormValues>;
  onNext: (data: Step1FormValues) => void;
}

export function Step1Registration({ defaultValues, onNext }: Step1RegistrationProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      surname: "",
      name: "",
      patronymic: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTos: false,
      agreePrivacy: false,
      confirmNoSanctions: false,
      ...defaultValues,
    },
  });

  const passwordValue = form.watch("password");
  const strength =
    passwordValue.length >= 12
      ? "Сильный"
      : passwordValue.length >= 8
      ? "Средний"
      : "Слабый";

  const onSubmit = (data: Step1FormValues) => {
    onNext(data);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-label="Форма регистрации"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
            aria-describedby={form.formState.errors.name ? "name-error" : undefined}
          />
          {form.formState.errors.name && (
            <p id="name-error" className="text-xs text-red-600">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="surname">Фамилия (как в документе)</Label>
          <Input
            id="surname"
            {...form.register("surname")}
            aria-invalid={!!form.formState.errors.surname}
            aria-describedby={
              form.formState.errors.surname ? "surname-error" : undefined
            }
          />
          {form.formState.errors.surname && (
            <p id="surname-error" className="text-xs text-red-600">
              {form.formState.errors.surname.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="patronymic">Отчество (опционально)</Label>
          <Input id="patronymic" {...form.register("patronymic")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
          />
          {form.formState.errors.email && (
            <p id="email-error" className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="password">Пароль</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              aria-invalid={!!form.formState.errors.password}
              aria-describedby={
                form.formState.errors.password ? "password-error" : undefined
              }
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-[color:var(--muted)]"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-[color:var(--muted)]">
            Минимум 8 символов, одна заглавная буква и цифра. Сложность: {strength}.
          </p>
          {form.formState.errors.password && (
            <p id="password-error" className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              {...form.register("confirmPassword")}
              aria-invalid={!!form.formState.errors.confirmPassword}
              aria-describedby={
                form.formState.errors.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-[color:var(--muted)]"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Скрыть пароль" : "Показать пароль"}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-xs text-red-600">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[rgba(248,249,252,0.8)] p-3 text-xs">
        <div className="flex items-start gap-2">
          <Checkbox
            id="agreeTos"
              checked={!!form.watch("agreeTos")}
            onCheckedChange={(v) => form.setValue("agreeTos", v === true)}
            aria-describedby={
              form.formState.errors.agreeTos ? "agreeTos-error" : undefined
            }
          />
          <Label htmlFor="agreeTos" className="font-normal">
            Согласен с{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 text-[color:var(--primary)]"
            >
              Terms of Service
            </Link>
          </Label>
        </div>
        {form.formState.errors.agreeTos && (
          <p id="agreeTos-error" className="text-xs text-red-600">
            {form.formState.errors.agreeTos.message}
          </p>
        )}

        <div className="flex items-start gap-2">
          <Checkbox
            id="agreePrivacy"
            checked={!!form.watch("agreePrivacy")}
            onCheckedChange={(v) => form.setValue("agreePrivacy", v === true)}
            aria-describedby={
              form.formState.errors.agreePrivacy ? "agreePrivacy-error" : undefined
            }
          />
          <Label htmlFor="agreePrivacy" className="font-normal">
            Согласен с{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 text-[color:var(--primary)]"
            >
              Privacy Policy (GDPR)
            </Link>
          </Label>
        </div>
        {form.formState.errors.agreePrivacy && (
          <p id="agreePrivacy-error" className="text-xs text-red-600">
            {form.formState.errors.agreePrivacy.message}
          </p>
        )}

        <div className="flex items-start gap-2">
          <Checkbox
            id="confirmNoSanctions"
            checked={!!form.watch("confirmNoSanctions")}
            onCheckedChange={(v) => form.setValue("confirmNoSanctions", v === true)}
            aria-describedby={
              form.formState.errors.confirmNoSanctions
                ? "confirmNoSanctions-error"
                : undefined
            }
          />
          <Label htmlFor="confirmNoSanctions" className="font-normal">
            Подтверждаю, что не включён в персональные санкционные списки ЕС/США
          </Label>
        </div>
        {form.formState.errors.confirmNoSanctions && (
          <p id="confirmNoSanctions-error" className="text-xs text-red-600">
            {form.formState.errors.confirmNoSanctions.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Продолжить</Button>
      </div>
    </form>
  );
}

