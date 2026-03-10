import { z } from "zod";

export const step1Schema = z
  .object({
    surname: z.string().min(1, "Укажите фамилию как в документе"),
    name: z.string().min(1, "Укажите имя"),
    patronymic: z.string().optional(),
    email: z
      .string()
      .min(1, "Укажите email")
      .email("Некорректный формат email"),
    password: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/[A-ZА-Я]/, "Минимум одна заглавная буква")
      .regex(/[0-9]/, "Минимум одна цифра"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
    agreeTos: z
      .boolean()
      .refine((v) => v === true, "Необходимо согласиться с Terms of Service"),
    agreePrivacy: z
      .boolean()
      .refine((v) => v === true, "Необходимо согласиться с Privacy Policy (GDPR)"),
    confirmNoSanctions: z
      .boolean()
      .refine(
        (v) => v === true,
        "Необходимо подтвердить отсутствие в санкционных списках ЕС/США"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type Step1FormValues = z.infer<typeof step1Schema>;

