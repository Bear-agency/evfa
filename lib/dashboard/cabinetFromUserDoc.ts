import { visaRequirements } from "@/lib/constants/visaRequirements";
import type { VisaType } from "@/types/apply";

export interface ResolvedCabinet {
  /** Сумма для отображения: переопределение админа или из типа визы. */
  requiredAmountEur: number | null;
  /** Срок блокировки (дней): из документа или 1 по умолчанию. */
  freezeDays: number;
  /** Текст реквизитов, заданный админом. */
  requisitesText: string;
}

function isVisaType(v: string): v is VisaType {
  return v in visaRequirements;
}

export function resolveCabinetFromUserDoc(data: Record<string, unknown>): ResolvedCabinet {
  const visa = data.visa as { visaType?: string } | undefined;
  const visaType = visa?.visaType;
  const fromVisa =
    visaType && isVisaType(visaType) ? visaRequirements[visaType].amount : null;

  const override = data.cabinetRequiredAmountEur;
  const requiredAmountEur =
    typeof override === "number" && Number.isFinite(override) && override > 0
      ? override
      : fromVisa;

  const fd = data.freezeDays;
  const freezeDays =
    typeof fd === "number" && Number.isFinite(fd) && fd >= 1 && fd <= 365
      ? Math.floor(fd)
      : 1;

  const req = data.cabinetRequisitesText;
  const requisitesText = typeof req === "string" ? req.trim() : "";

  return { requiredAmountEur, freezeDays, requisitesText };
}
