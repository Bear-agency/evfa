import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseAuth, db, getMissingFirebaseWebEnvVars } from "@/lib/firebase/client";
import type {
  Step1RegistrationData,
  Step2ApplicantInfoData,
  Step3VisaDetailsData,
} from "@/types/apply";

/** Firestore rejects explicit `undefined` field values. */
function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

export async function saveNewUserApplication(
  step1: Step1RegistrationData,
  step2: Step2ApplicantInfoData,
  step3: Step3VisaDetailsData
) {
  const missingEnv = getMissingFirebaseWebEnvVars();
  if (missingEnv.length > 0) {
    const err = new Error(
      `Missing Firebase web env: ${missingEnv.join(", ")}`
    ) as Error & { code: string };
    err.code = "evfa/missing-env";
    throw err;
  }

  const { password, confirmPassword, ...registration } = step1;
  void confirmPassword;

  const cred = await createUserWithEmailAndPassword(
    firebaseAuth,
    step1.email,
    password
  );

  const payload = {
    uid: cred.user.uid,
    role: "user" as const,
    applicationStatus: "submitted" as const,
    freezeDays: 1,
    registration: omitUndefined(registration as unknown as Record<string, unknown>),
    applicant: omitUndefined(step2 as unknown as Record<string, unknown>),
    visa: omitUndefined(step3 as unknown as Record<string, unknown>),
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, "users", cred.user.uid), payload);
  } catch (err) {
    await deleteUser(cred.user);
    throw err;
  }

  return cred.user;
}
