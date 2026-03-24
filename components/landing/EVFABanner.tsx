export default function EVFABanner() {
  return (
    <section
      aria-label="EVFA identity banner"
      className="relative m-0 w-full overflow-hidden border-b border-[rgba(184,137,26,0.35)] bg-[linear-gradient(135deg,#0D2B5E_0%,#112B5A_50%,#0A2040_100%)]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[length:40px_40px] bg-[image:linear-gradient(rgba(184,137,26,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(184,137,26,0.07)_1px,transparent_1px)]"
        style={{
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)",
        }}
      />

      <div className="container relative z-10 py-5 md:min-h-[72px] md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
          <div className="hidden items-center [animation:fadeUp_0.5s_ease_0.05s_both] md:flex">
            <span
              aria-hidden="true"
              className="mr-3 text-2xl [filter:drop-shadow(0_0_6px_rgba(184,137,26,0.4))]"
            >
              🇪🇺
            </span>
            <div>
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[rgba(245,240,232,0.65)]">
                Официальный финансовый сервис
              </p>
              <p className="mt-[2px] font-sans text-[0.625rem] tracking-[0.08em] text-[rgba(245,240,232,0.4)]">
                Зарегистрировано в Европейском союзе
              </p>
            </div>
          </div>

          <div className="text-center [animation:fadeUp_0.6s_ease_0.15s_both]">
            <div className="font-serif text-[1.75rem] font-semibold leading-none tracking-[0.22em] text-[#F5F0E8] [text-shadow:0_0_40px_rgba(184,137,26,0.3)] md:text-[2rem]">
              EVFA
            </div>
            <div className="mx-auto my-[6px] h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(184,137,26,0.9),transparent)]" />
            <div className="font-sans text-[0.5625rem] font-medium uppercase tracking-[0.18em] text-[rgba(184,137,26,0.8)]">
              European Visa Financial Authority
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 [animation:fadeUp_0.5s_ease_0.25s_both] md:flex-col md:items-end md:gap-1">
            <div className="whitespace-nowrap rounded-[2px] border border-[rgba(184,137,26,0.4)] bg-[rgba(184,137,26,0.1)] px-[10px] py-[3px] font-sans text-[0.625rem] font-medium tracking-[0.08em] text-[rgba(184,137,26,0.9)]">
              🔒 Санкционный комплаенс
            </div>
            <div className="whitespace-nowrap rounded-[2px] border border-[rgba(184,137,26,0.2)] bg-[rgba(184,137,26,0.06)] px-[10px] py-[3px] font-sans text-[0.625rem] font-medium tracking-[0.08em] text-[rgba(245,240,232,0.55)]">
              ✓ GDPR Protected
            </div>
            <div className="whitespace-nowrap rounded-[2px] border border-[rgba(184,137,26,0.2)] bg-[rgba(184,137,26,0.06)] px-[10px] py-[3px] font-sans text-[0.625rem] font-medium tracking-[0.08em] text-[rgba(245,240,232,0.55)]">
              ✓ AML / KYC
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
