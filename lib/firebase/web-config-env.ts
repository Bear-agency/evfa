/** Server-only env names for the Firebase *web* SDK (same values as in Firebase Console → web app). */
export const FIREBASE_WEB_ENV = {
  apiKey: "FIREBASE_WEB_API_KEY",
  authDomain: "FIREBASE_WEB_AUTH_DOMAIN",
  projectId: "FIREBASE_WEB_PROJECT_ID",
  storageBucket: "FIREBASE_WEB_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_WEB_MESSAGING_SENDER_ID",
  appId: "FIREBASE_WEB_APP_ID",
} as const;

export type FirebaseWebEnvKey = keyof typeof FIREBASE_WEB_ENV;
