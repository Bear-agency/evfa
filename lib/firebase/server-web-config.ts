import "server-only";

import type { FirebaseOptions } from "firebase/app";
import { FIREBASE_WEB_ENV, type FirebaseWebEnvKey } from "@/lib/firebase/web-config-env";

function trimEnv(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v === "" ? undefined : v;
}

function readField(key: FirebaseWebEnvKey): string | undefined {
  return trimEnv(process.env[FIREBASE_WEB_ENV[key]]);
}

/** Names of missing server env vars (for errors and tooling). */
export function getMissingFirebaseWebEnvNames(): string[] {
  const missing: string[] = [];
  (Object.keys(FIREBASE_WEB_ENV) as FirebaseWebEnvKey[]).forEach((k) => {
    if (!readField(k)) missing.push(FIREBASE_WEB_ENV[k]);
  });
  return missing;
}

/**
 * Web app config from server env (no NEXT_PUBLIC_*). Passed into the client via the root layout.
 * The Firebase web API key is not a secret; access is enforced with rules and (optionally) API key restrictions in Google Cloud.
 */
export function getFirebaseWebOptions(): FirebaseOptions {
  const missing = getMissingFirebaseWebEnvNames();
  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase web config (set on the server only): ${missing.join(", ")}. See .env.example.`
    );
  }
  return {
    apiKey: readField("apiKey")!,
    authDomain: readField("authDomain")!,
    projectId: readField("projectId")!,
    storageBucket: readField("storageBucket")!,
    messagingSenderId: readField("messagingSenderId")!,
    appId: readField("appId")!,
  };
}
