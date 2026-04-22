import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeCode(code: string): string {
  return code.replace(/\D/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    const emailRaw = typeof body.email === "string" ? body.email : "";
    const codeRaw = typeof body.code === "string" ? body.code : "";

    const email = normalizeEmail(emailRaw);
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const code = normalizeCode(codeRaw);
    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code (expected 4 digits)" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    const verifRef = db.collection("emailVerifications").doc(email);
    const snap = await verifRef.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Код не отправлялся или истёк." },
        { status: 400 }
      );
    }

    const data = snap.data() as
      | { codeHash?: string; expiresAt?: Timestamp }
      | undefined;

    if (!data?.codeHash || !data?.expiresAt) {
      return NextResponse.json(
        { error: "Код невалиден. Отправьте email ещё раз." },
        { status: 400 }
      );
    }

    if (data.expiresAt.toMillis() <= Date.now()) {
      return NextResponse.json(
        { error: "Время кода истекло. Отправьте email ещё раз." },
        { status: 400 }
      );
    }

    // timingSafeEqual предотвращает грубые атаки по времени сравнения.
    const inputHash = crypto.createHash("sha256").update(code).digest();
    const storedHash = Buffer.from(data.codeHash, "hex");
    if (storedHash.length !== inputHash.length) {
      return NextResponse.json({ error: "Неверный код." }, { status: 400 });
    }
    const ok = crypto.timingSafeEqual(storedHash, inputHash);
    if (!ok) {
      return NextResponse.json({ error: "Неверный код." }, { status: 400 });
    }

    await verifRef.set(
      {
        verifiedAt: Timestamp.now(),
        emailVerifiedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
