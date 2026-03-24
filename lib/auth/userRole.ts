import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

export type UserRole = "user" | "admin";

export async function fetchUserRole(uid: string): Promise<UserRole | null> {
  const snap = await getDoc(doc(getDb(), "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { role?: string };
  if (data.role === "admin") return "admin";
  return "user";
}
