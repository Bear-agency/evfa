export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export interface ThreadMessage {
  id: string;
  text: string;
  sender: "user" | "admin";
  createdAt: Date | null;
}

export interface UserDashboardProfile {
  displayName: string;
  applicationStatus: ApplicationStatus;
  email: string | null;
}

/** Данные для блока «реквизиты / сумма» в кабинете (из Firestore + расчёт). */
export interface UserCabinetDisplay {
  requiredAmountEur: number | null;
  freezeDays: number;
  requisitesText: string;
}
