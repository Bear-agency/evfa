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
      <div className="container relative py-16 md:py-20 lg:py-24">
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
            className="flex max-w-xl flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Button asChild size="lg" variant="accent" className="w-full">
              <Link href="/apply">Подать заявку на открытие Счета</Link>
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

      </div>
    </section>
  );
}

