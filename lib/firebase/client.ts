import { getApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

import { FIREBASE_WEB_ENV } from "@/lib/firebase/web-config-env";

function assertFirebaseReady(): void {
  if (getApps().length === 0) {
    throw new Error(
      "Firebase is not initialized. Ensure FirebaseInitProvider wraps the app and server env FIREBASE_WEB_* is set."
    );
  }
}

export function getFirebaseAuth(): Auth {
  assertFirebaseReady();
  return getAuth(getApp());
}

export function getDb(): Firestore {
  assertFirebaseReady();
  return getFirestore(getApp());
}

/**
 * For user-facing errors when the app failed to bootstrap (e.g. misconfigured deployment).
 * Returns env var names to mention in copy.
 */
export function getMissingFirebaseWebEnvVarNamesForMessage(): string {
  return Object.values(FIREBASE_WEB_ENV).join(", ");
}
