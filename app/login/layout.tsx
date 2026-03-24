import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-[color:var(--background)] text-sm text-[color:var(--muted)]">
          Загрузка…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
