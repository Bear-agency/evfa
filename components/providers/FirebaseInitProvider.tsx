"use client";

import type { ReactNode } from "react";
import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";

/**
 * Initializes the default Firebase app on the client using config supplied from the server layout.
 * Keeps web SDK settings out of NEXT_PUBLIC_* (they are still sent to the browser with the page, as required for client Auth/Firestore).
 */
export function FirebaseInitProvider({
  config,
  children,
}: {
  config: FirebaseOptions;
  children: ReactNode;
}) {
  if (typeof window !== "undefined" && !getApps().length) {
    initializeApp(config);
  }
  return <>{children}</>;
}
