import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function trimEnv(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v === "" ? undefined : v;
}

/** Raw values from env (may be undefined). */
const firebaseEnvFields = {
  apiKey: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: trimEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
} as const;

const ENV_NAME_BY_FIELD: Record<keyof typeof firebaseEnvFields, string> = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

/** Names of missing public env vars (for clear errors before Auth/Firestore calls). */
export function getMissingFirebaseWebEnvVars(): string[] {
  return (Object.keys(firebaseEnvFields) as (keyof typeof firebaseEnvFields)[])
    .filter((k) => !firebaseEnvFields[k])
    .map((k) => ENV_NAME_BY_FIELD[k]);
}

/**
 * Options passed to initializeApp must not include keys with value `undefined`
 * (otherwise Auth often fails with auth/configuration-not-found).
 */
const firebaseWebOptions = Object.fromEntries(
  Object.entries(firebaseEnvFields).filter((entry): entry is [string, string] =>
    Boolean(entry[1])
  )
) as FirebaseOptions;

const app = getApps().length ? getApp() : initializeApp(firebaseWebOptions);

export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
