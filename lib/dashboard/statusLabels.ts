import type { ApplicationStatus } from "@/types/dashboard";

export function applicationStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case "submitted":
      return "Заявка подана";
    case "under_review":
      return "На рассмотрении";
    case "approved":
      return "Одобрено";
    case "rejected":
      return "Отклонено";
    default:
      return "Заявка подана";
  }
}

export function applicationStatusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case "submitted":
      return "bg-[rgba(27,58,107,0.1)] text-[color:var(--primary)] border-[color:rgba(27,58,107,0.2)]";
    case "under_review":
      return "bg-amber-50 text-amber-900 border-amber-200";
    case "approved":
      return "bg-emerald-50 text-emerald-900 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-900 border-red-200";
    default:
      return "bg-[rgba(27,58,107,0.1)] text-[color:var(--primary)]";
  }
}

export function parseApplicationStatus(value: unknown): ApplicationStatus {
  if (
    value === "submitted" ||
    value === "under_review" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }
  return "submitted";
}
