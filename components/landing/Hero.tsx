"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  "Соответствие нормам ЕС",
  "Санкционный комплаенс",
  "Проверка личности (KYC)",
  "Защита данных (GDPR)",
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-[color:var(--border)] bg-white"
      id="about"
    >
      <div className="absolute inset-0 evfa-grid opacity-50" />
      <div className="container relative grid gap-10 py-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:py-20 lg:py-24">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[rgba(255,255,255,0.9)] px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-[color:var(--primary)]" />
            Европейская платформа финансового подтверждения
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-serif text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            Финансовое подтверждение для оформления визы в страны ЕС
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl text-sm leading-relaxed text-[color:var(--muted)] sm:text-base"
          >
            Открытие подтверждающих счетов в соответствии с требованиями консульств.
            Для заявителей из юрисдикций с ограниченным доступом к международному
            банкингу — с акцентом на санкционный комплаенс, KYC и защиту данных.
          </motion.p>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
              <Link href="/apply">ПОДАТЬ ЗАЯВКУ НА СЧЕТА</Link>
            </Button>
            <p className="max-w-xl text-xs leading-relaxed text-[color:var(--muted)]">
              Компания не предоставляет услуги лицам, включённым в персональные
              санкционные списки ЕС и США. Все заявки проходят многоуровневую
              проверку санкционных и AML/KYC рисков.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-3 pt-4 text-xs text-[color:var(--muted)] sm:grid-cols-2 md:grid-cols-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {badges.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[rgba(255,255,255,0.9)] px-3 py-2 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-[color:var(--primary)]" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-center"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-white/90 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>Пример выписки EVFA</span>
              <span className="rounded-full bg-[rgba(27,58,107,0.06)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[color:var(--primary)]">
                Sample
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--muted)]">Имя заявителя</span>
                <span className="font-medium text-[color:var(--foreground)]">
                  Ivan Petrov
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--muted)]">Страна назначения</span>
                <span className="font-medium text-[color:var(--foreground)]">
                  Германия (DE)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--muted)]">Тип визы</span>
                <span className="font-medium text-[color:var(--foreground)]">
                  Студенческая
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[rgba(13,27,42,0.03)] p-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
                    Сумма подтверждения
                  </div>
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">
                    5 000 EUR
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
                    Срок блокировки
                  </div>
                  <div className="text-sm font-semibold text-[color:var(--foreground)]">
                    90 дней
                  </div>
                </div>
              </div>
              <p className="pt-3 text-[10px] leading-relaxed text-[color:var(--muted)]">
                Счёт открыт в соответствии с требованиями консульства. Сведения о
                счёте могут быть направлены напрямую в консульство по официальным
                каналам.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

