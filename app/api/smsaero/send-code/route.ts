import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

const SMSAERO_GATE_BASE_URL = "https://gate.smsaero.ru/v2";

const VERIFICATION_TTL_MS = 15 * 60 * 1000; // 15 минут
const SEND_COOLDOWN_MS = 30 * 1000; // антиспам: минимум 30 сек между отправками

function getEnvOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing env var ${name}`);
  }
  return v;
}

function sanitizePhoneDigits(phone: string): string {
  // SMSAero ожидает только цифры в параметре number.
  return phone.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = typeof body.phone === "string" ? body.phone : "";

    if (!phone) {
      return NextResponse.json(
        { error: "Missing phone" },
        { status: 400 }
      );
    }

    const login = getEnvOrThrow("SMSAERO_LOGIN");
    const apiKey = getEnvOrThrow("SMSAERO_API_KEY");
    const sign = getEnvOrThrow("SMSAERO_SIGN");

    const number = sanitizePhoneDigits(phone);
    if (!/^\d{8,15}$/.test(number)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    const verifRef = db.collection("smsVerifications").doc(number);

    const existing = await verifRef.get();
    if (existing.exists) {
      const data = existing.data() as
        | { lastSendAt?: Timestamp; expiresAt?: Timestamp }
        | undefined;
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

    // Сообщение можно адаптировать под ваш бренд/формат.
    const text = `Ваш код подтверждения: ${code}`;

    const url =
      `${SMSAERO_GATE_BASE_URL}/sms/send` +
      `?number=${encodeURIComponent(number)}` +
      `&text=${encodeURIComponent(text)}` +
      `&sign=${encodeURIComponent(sign)}`;

    const basicAuth = Buffer.from(`${login}:${apiKey}`).toString("base64");
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
    });

    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!res.ok || !json?.success) {
      return NextResponse.json(
        { error: json?.message || "SMSAero error" },
        { status: 400 }
      );
    }

    await verifRef.set(
      {
        phone: number,
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

