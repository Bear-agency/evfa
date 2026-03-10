import { z } from "zod";

const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;

const fileRefinement = (maxMb: number, types: string[]) =>
  z
    .any()
    .refine((file) => file instanceof File, "Загрузите файл")
    .refine(
      (file) => file.size <= maxMb * 1024 * 1024,
      `Максимальный размер файла — ${maxMb}MB`
    )
    .refine(
      (file) => types.includes(file.type),
      "Формат файла не поддерживается"
    );

export const step4Schema = z.object({
  passport: fileRefinement(MAX_IMAGE_SIZE_MB, [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ]),
  registrationPage: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        (file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024 &&
          ["image/jpeg", "image/png", "application/pdf"].includes(file.type)),
      "Проверьте размер и формат файла"
    ),
  selfie: fileRefinement(MAX_IMAGE_SIZE_MB, ["image/jpeg", "image/png"]),
  video: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        (file.size <= MAX_VIDEO_SIZE_MB * 1024 * 1024 &&
          file.type.startsWith("video/")),
      "Максимальный размер видео 50MB, формат — video/*"
    ),
});

export type Step4FormValues = z.infer<typeof step4Schema>;

