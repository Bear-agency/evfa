import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

const VERIFICATION_TTL_MS = 15 * 60 * 1000; // 15 минут
const SEND_COOLDOWN_MS = 30 * 1000; // антиспам: минимум 30 сек между отправками

function getEnvOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing env var ${name}`);
  }
  return v;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  // Базовая серверная валидация. Более строгая проверка уже есть на клиенте.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmailCode(email: string, code: string) {
  const apiKey = getEnvOrThrow("RESEND_API_KEY");
  const from = getEnvOrThrow("RESEND_FROM_EMAIL");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Код подтверждения EVFA",
      text: `Ваш код подтверждения: ${code}`,
      html: `<p>Ваш код подтверждения: <strong>${code}</strong></p><p>Код действует 15 минут.</p>`,
    }),
  });

  const json = (await response.json().catch(() => null)) as
    | { message?: string; error?: string | { message?: string } }
    | null;

  if (!response.ok) {
    const errorText =
      (typeof json?.error === "string" && json.error) ||
      (typeof json?.error === "object" && json.error?.message) ||
      json?.message ||
      "Email service error";
    throw new Error(errorText);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const emailRaw = typeof body.email === "string" ? body.email : "";
    const email = normalizeEmail(emailRaw);

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const db = getFirebaseAdminDb();
    const verifRef = db.collection("emailVerifications").doc(email);

    const existing = await verifRef.get();
    if (existing.exists) {
      const data = existing.data() as { lastSendAt?: Timestamp } | undefined;
      const lastSendAtMs = data?.lastSendAt?.toMillis();
      if (lastSendAtMs && Date.now() - lastSendAtMs < SEND_COOLDOWN_MS) {
        return NextResponse.json(
          { error: "Код можно отправлять не чаще чем раз в 30 секунд." },
          { status: 429 }
        );
      }
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");

    await sendEmailCode(email, code);

    await verifRef.set(
      {
        email,
        codeHash,
        expiresAt: Timestamp.fromMillis(Date.now() + VERIFICATION_TTL_MS),
        createdAt: Timestamp.now(),
        lastSendAt: Timestamp.now(),
        verifiedAt: null,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
