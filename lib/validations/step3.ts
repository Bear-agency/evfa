import { z } from "zod";
import type { VisaType } from "@/types/apply";

export const visaTypes: { value: VisaType; label: string }[] = [
  { value: "student", label: "Студенческая" },
  { value: "work", label: "Рабочая" },
  { value: "family", label: "Воссоединение семьи" },
  { value: "research", label: "Исследовательская" },
  { value: "entrepreneur", label: "Предпринимательская" },
];

export const step3Schema = z.object({
  destinationCountry: z.string().min(1, "Укажите страну назначения"),
  visaType: z.enum(
    ["student", "work", "family", "research", "entrepreneur"] as const
  ),
});

export type Step3FormValues = z.infer<typeof step3Schema>;

