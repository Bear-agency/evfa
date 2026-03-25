import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

function sanitizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function normalizeCode(code: string): string {
  return code.replace(/\D/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const phoneRaw = typeof body.phone === "string" ? body.phone : "";
    const codeRaw = typeof body.code === "string" ? body.code : "";

    if (!phoneRaw) {
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });
    }
    const phone = sanitizePhoneDigits(phoneRaw);
    if (!/^\d{8,15}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    const code = normalizeCode(codeRaw);
    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid code (expected 4 digits)" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    const verifRef = db.collection("smsVerifications").doc(phone);
    const snap = await verifRef.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Код не отправлялся или истёк." },
        { status: 400 }
      );
    }

    const data = snap.data() as
      | { codeHash?: string; expiresAt?: Timestamp; verifiedAt?: Timestamp }
      | undefined;
    const codeHash = data?.codeHash;
    const expiresAt = data?.expiresAt;

    if (!codeHash || !expiresAt) {
      return NextResponse.json(
        { error: "Код невалиден. Отправьте SMS ещё раз." },
        { status: 400 }
      );
    }

    if (expiresAt.toMillis() <= Date.now()) {
      return NextResponse.json(
        { error: "Время кода истекло. Отправьте SMS ещё раз." },
        { status: 400 }
      );
    }

    // timingSafeEqual предотвращает грубые атаки по времени сравнения.
    const inputHash = crypto.createHash("sha256").update(code).digest();
    const storedHash = Buffer.from(codeHash, "hex");
    if (storedHash.length !== inputHash.length) {
      return NextResponse.json(
        { error: "Неверный код." },
        { status: 400 }
      );
    }
    const ok = crypto.timingSafeEqual(storedHash, inputHash);
    if (!ok) {
      return NextResponse.json({ error: "Неверный код." }, { status: 400 });
    }

    await verifRef.set(
      {
        verifiedAt: Timestamp.now(),
        phoneVerifiedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

