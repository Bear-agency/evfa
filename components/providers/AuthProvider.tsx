"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onIdTokenChanged, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncSessionCookie(user: User | null) {
  if (!user) {
    const res = await fetch("/api/auth/session", {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      console.warn("Session delete failed", res.status);
    }
    return;
  }

  const idToken = await user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Session cookie failed: ${res.status} ${body}`);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onIdTokenChanged(getFirebaseAuth(), async (nextUser) => {
      try {
        // Set cookie before React sees a logged-in user so middleware sees the
        // session on the next navigation (e.g. admin-login → /admin).
        await syncSessionCookie(nextUser);
      } catch (err) {
        console.error("Session cookie sync failed", err);
      } finally {
        setUser(nextUser);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      logout: async () => {
        await signOut(getFirebaseAuth());
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
