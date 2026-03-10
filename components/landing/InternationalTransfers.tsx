export function InternationalTransfers() {
  return (
    <section className="border-b border-[color:var(--border)] bg-white py-14">
      <div className="container grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
            Международные переводы и альтернативные каналы
          </h2>
          <p className="mb-4 text-sm text-[color:var(--muted)]">
            EVFA учитывает ограничения на международные переводы из российских и
            других банков. Там, где законодательство позволяет, средства могут быть
            зачислены на подтверждающий счёт с российских счетов или карт.
          </p>
          <p className="mb-4 text-sm text-[color:var(--muted)]">
            В случаях, когда использование SWIFT ограничено, мы рассматриваем
            альтернативные каналы при условии их полной правовой и комплаенсной
            допустимости. Все операции структурируются с учётом требований валютного
            и санкционного регулирования.
          </p>
        </div>
        <div className="space-y-3 rounded-xl border border-[color:var(--border)] bg-[rgba(248,249,252,0.9)] p-5 text-xs text-[color:var(--muted)] shadow-sm">
          <h3 className="text-sm font-semibold text-[color:var(--foreground)]">
            Комплаенс и контроль операций
          </h3>
          <ul className="space-y-2">
            <li>
              ✔ Все операции проходят обязательную проверку{" "}
              <span className="font-medium">AML/KYC</span> и санкционный скрининг.
            </li>
            <li>
              ✔ Приоритет — прозрачное происхождение средств и отсутствие связей с
              санкционными лицами/структурами.
            </li>
            <li>
              ✔ Стандарт обработки — требования европейских платёжных институтов и
              банков.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

