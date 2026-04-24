import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { FirebaseInitProvider } from "@/components/providers/FirebaseInitProvider";
import { getFirebaseWebOptions } from "@/lib/firebase/server-web-config";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "EVFA — European Visa Financial Authority",
  description:
    "Финансовое подтверждение для оформления визы в страны ЕС. EVFA — European Visa Financial Authority.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let firebaseWebConfig;
  try {
    firebaseWebConfig = getFirebaseWebOptions();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <html lang="ru">
        <body
          className={`${dmSans.variable} ${playfair.variable} antialiased p-6 text-sm`}
        >
          <p className="font-semibold text-red-700">Конфигурация Firebase</p>
          <pre className="mt-2 max-w-3xl whitespace-pre-wrap text-[color:var(--muted)]">
            {message}
          </pre>
        </body>
      </html>
    );
  }

  return (
    <html lang="ru">
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <FirebaseInitProvider config={firebaseWebConfig}>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </FirebaseInitProvider>
      </body>
    </html>
  );
}
