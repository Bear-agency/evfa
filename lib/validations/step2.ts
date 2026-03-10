import { z } from "zod";

const isAdult = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  const adultDate = new Date(
    date.getFullYear() + 18,
    date.getMonth(),
    date.getDate()
  );
  return adultDate <= now;
};

// Простая проверка международного формата: начинается с +, минимум 8-9 цифр
const phoneRegex = /^\+\d{8,15}$/;

export const step2Schema = z
  .object({
    birthDate: z
      .string()
      .min(1, "Укажите дату рождения")
      .refine(isAdult, "Сервис доступен только заявителям 18+ лет"),
    citizenship: z.string().min(1, "Укажите гражданство"),
    residenceCountry: z.string().min(1, "Укажите страну проживания"),
    taxResidency: z.string().min(1, "Укажите налоговое резидентство"),
    phone: z
      .string()
      .min(1, "Укажите номер телефона")
      .regex(phoneRegex, "Укажите номер в международном формате, например +4912345678"),
    hasSecondCitizenship: z.boolean(),
    secondCitizenship: z.string().optional(),
    hasResidencePermit: z.boolean(),
    residencePermitCountry: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.hasSecondCitizenship || (data.secondCitizenship && data.secondCitizenship.length),
    {
      message: "Укажите второе гражданство",
      path: ["secondCitizenship"],
    }
  )
  .refine(
    (data) =>
      !data.hasResidencePermit ||
      (data.residencePermitCountry && data.residencePermitCountry.length),
    {
      message: "Укажите страну ВНЖ",
      path: ["residencePermitCountry"],
    }
  );

export type Step2FormValues = z.infer<typeof step2Schema>;

