import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-white/80">
      <div className="container flex flex-col gap-4 py-8 text-xs text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-sm font-semibold text-[color:var(--primary)]">
            EVFA — European Visa Financial Authority
          </span>
          <p className="max-w-xl">
            Информация на сайте носит справочный характер и не является
            предложением в смысле гражданского законодательства. Компания не
            предоставляет услуги лицам, включённым в персональные санкционные
            списки ЕС и США.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/terms"
            className="hover:text-[color:var(--foreground)] underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="hover:text-[color:var(--foreground)] underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

