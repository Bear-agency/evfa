import { Clock3 } from "lucide-react";

const steps = [
  {
    title: "Онлайн-регистрация",
    description: "Базовые данные заявителя и создание защищённого личного кабинета.",
  },
  {
    title: "Проверка личности и документов",
    description: "Загрузка паспорта, подтверждения адреса и сопутствующих документов.",
  },
  {
    title: "Санкционная и комплаенс-проверка",
    description:
      "Проверка по санкционным спискам ЕС/США, PEP-статус и источники средств.",
  },
  {
    title: "Открытие подтверждающего счета",
    description:
      "Резервирование средств на отдельном счёте с учётом требований консульства.",
  },
  {
    title: "Выдача официального финансового подтверждения",
    description:
      "Формирование документа, который может быть предоставлен консульству или ВУЗу.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-[color:var(--border)] bg-[rgba(248,249,252,0.9)] py-14">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
              Как это работает
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted)]">
              Процесс выстроен в соответствии с требованиями европейского
              регулирования: от KYC и санкционного скрининга до безопасного открытия
              подтверждающих счетов.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-3 py-1 text-xs text-[color:var(--muted)]">
            <Clock3 className="h-4 w-4 text-[color:var(--primary)]" />
            Срок обработки: <span className="font-medium">1-3 дня</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col rounded-lg border border-[color:var(--border)] bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(27,58,107,0.08)] text-xs font-semibold text-[color:var(--primary)]">
                  {index + 1}
                </div>
                <h3 className="text-sm font-medium text-[color:var(--foreground)]">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-[color:var(--muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

