import { Suspense } from "react";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[50vh] items-center justify-center text-sm"
          style={{ color: "rgba(245,240,232,0.55)" }}
        >
          Загрузка…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
