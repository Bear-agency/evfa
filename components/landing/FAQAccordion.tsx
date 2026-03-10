import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    id: "q1",
    question: "Является ли EVFA банком или лицензированным платёжным институтом?",
    answer:
      "EVFA — это сервис финансового подтверждения, работающий в партнёрстве с лицензированными европейскими платёжными институтами и банками. Конкретная структура взаимодействия зависит от страны назначения и профиля заявителя.",
  },
  {
    id: "q2",
    question: "Могу ли я использовать российский банк для зачисления средств?",
    answer:
      "В ряде случаев зачисление средств возможно с российских счетов и карт, если это не противоречит санкционному и валютному регулированию, а также политике партнёрских институтов. Возможность такого сценария оценивается индивидуально в рамках комплаенс-процесса.",
  },
  {
    id: "q3",
    question: "Гарантирует ли наличие счёта в EVFA выдачу визы?",
    answer:
      "Нет. Выдача визы всегда остаётся дискреционным решением консульства. EVFA обеспечивает корректное с точки зрения требований консульств финансовое подтверждение, но не влияет на оценку миграционных рисков и иных факторов.",
  },
];

export function FAQAccordion() {
  return (
    <section
      className="border-t border-[color:var(--border)] bg-[rgba(248,249,252,0.9)] py-14"
      id="faq"
    >
      <div className="container max-w-3xl">
        <h2 className="mb-3 font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
          FAQ — часто задаваемые вопросы
        </h2>
        <p className="mb-6 text-sm text-[color:var(--muted)]">
          Ниже — ответы на ключевые вопросы о структуре сервиса, источниках средств и
          связи финансового подтверждения с визовым решением.
        </p>
        <Accordion type="single" collapsible className="divide-y divide-[color:var(--border)] rounded-lg border border-[color:var(--border)] bg-white">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="px-4">
              <AccordionTrigger className="text-sm font-medium text-[color:var(--foreground)]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-[color:var(--muted)]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

