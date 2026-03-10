import { Shield, Scale, Lock, FileCheck2 } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Европейская регистрация",
    description: "Структура, ориентированная на требования европейских регуляторов.",
  },
  {
    icon: Scale,
    title: "Прозрачный комплаенс",
    description:
      "Фокус на санкционный скрининг, AML/KYC и документирование происхождения средств.",
  },
  {
    icon: Lock,
    title: "Безопасность средств",
    description:
      "Средства на подтверждающих счетах резервируются и используются только по назначению.",
  },
  {
    icon: FileCheck2,
    title: "Защита данных",
    description:
      "Практики обработки персональных данных в логике европейского регулирования (GDPR).",
  },
];

export function WhyEVFA() {
  return (
    <section className="border-b border-[color:var(--border)] bg-white py-14">
      <div className="container">
        <h2 className="mb-3 font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
          Почему EVFA
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-[color:var(--muted)]">
          Мы соединяем институциональный подход европейского комплаенса с пониманием
          реальных ограничений, с которыми сталкиваются заявители из
          санкционно-чувствительных юрисдикций.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-3 rounded-lg border border-[color:var(--border)] bg-[rgba(248,249,252,0.9)] p-4 shadow-sm"
            >
              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(27,58,107,0.08)]">
                <Icon className="h-4 w-4 text-[color:var(--primary)]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[color:var(--foreground)]">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

