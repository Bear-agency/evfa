/** Суммы по типу визы; срок блокировки в справочнике — 1 день (стандарт для продукта). */
export const visaRequirements = {
  student: { amount: 3150, lockDays: 1 },
  work: { amount: 3150, lockDays: 1 },
  family: { amount: 7500, lockDays: 1 },
  research: { amount: 8000, lockDays: 1 },
  entrepreneur: { amount: 15000, lockDays: 1 },
} as const;

export type VisaCategory = keyof typeof visaRequirements;

