export const visaRequirements = {
  student: { amount: 5000, lockDays: 90 },
  work: { amount: 3150, lockDays: 60 },
  family: { amount: 7500, lockDays: 90 },
  research: { amount: 8000, lockDays: 90 },
  entrepreneur: { amount: 15000, lockDays: 180 },
} as const;

export type VisaCategory = keyof typeof visaRequirements;

