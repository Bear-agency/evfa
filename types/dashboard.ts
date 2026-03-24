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
