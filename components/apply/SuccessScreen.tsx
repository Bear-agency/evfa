"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  onBackToStart: () => void;
}

export function SuccessScreen({ onBackToStart }: SuccessScreenProps) {
  const reference = `EVFA-2024-${Math.floor(10000 + Math.random() * 89999)}`;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="font-serif text-xl font-semibold text-[color:var(--foreground)]">
          Ваша заявка принята
        </h2>
        <p className="text-sm text-[color:var(--muted)]">
          Срок рассмотрения: 1–5 рабочих дней. Статус заявки и дополнительные
          запросы по документам будут направлены на указанный вами email.
        </p>
        <p className="text-xs text-[color:var(--muted)]">
          Номер вашей заявки:{" "}
          <span className="font-mono font-semibold text-[color:var(--foreground)]">
            {reference}
          </span>
        </p>
      </div>
      <Button className="mt-2" onClick={onBackToStart}>
        Подать ещё одну заявку
      </Button>
    </div>
  );
}

