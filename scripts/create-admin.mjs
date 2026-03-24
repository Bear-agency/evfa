/**
 * One-off: create Firebase Auth user + Firestore users/{uid} with role admin.
 *
 * Usage (from project root, Node 20+):
 *   node --env-file=.env scripts/create-admin.mjs <email> <password>
 *
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node --env-file=.env scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in env.");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

const auth = getAuth();
const db = getFirestore();

try {
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log("Auth user already exists:", userRecord.uid);
  } catch (e) {
    if (e?.code === "auth/user-not-found") {
      userRecord = await auth.createUser({
        email,
        password,
        emailVerified: false,
      });
      console.log("Created Auth user:", userRecord.uid);
    } else {
      throw e;
    }
  }

  await db
    .collection("users")
    .doc(userRecord.uid)
    .set(
      {
        uid: userRecord.uid,
        role: "admin",
        applicationStatus: "approved",
        freezeDays: 1,
        registration: {
          email,
          name: "Admin",
          surname: "EVFA",
        },
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  console.log("Firestore users/" + userRecord.uid + " set with role: admin");
  console.log("Done. Sign in at /admin-login with this email and password.");
} catch (err) {
  console.error(err?.message || err);
  process.exit(1);
}
