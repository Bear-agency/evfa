import { euCountriesRu } from "@/lib/constants/countries";

export function CountriesGrid() {
  return (
    <section
      className="border-b border-[color:var(--border)] bg-[rgba(248,249,252,0.9)] py-14"
      id="countries"
    >
      <div className="container">
        <h2 className="mb-3 font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
          Страны назначения
        </h2>
        <p className="mb-8 max-w-2xl text-sm text-[color:var(--muted)]">
          EVFA подготавливает финансовые подтверждения для подачи на визы в страны
          Европейского Союза. Поддерживаются все 27 государств — членов ЕС.
        </p>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
          {euCountriesRu.map((country) => (
            <div
              key={country.code}
              className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-white px-3 py-2 text-xs shadow-sm"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="text-[color:var(--foreground)]">{country.nameRu}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

