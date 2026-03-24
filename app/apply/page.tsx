"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepIndicator } from "@/components/apply/StepIndicator";
import { Step1Registration } from "@/components/apply/Step1Registration";
import { Step2ApplicantInfo } from "@/components/apply/Step2ApplicantInfo";
import { Step3VisaDetails } from "@/components/apply/Step3VisaDetails";
import { SuccessScreen } from "@/components/apply/SuccessScreen";
import { saveNewUserApplication } from "@/lib/apply/saveApplication";
import type {
  ApplyStep,
  Step1RegistrationData,
  Step2ApplicantInfoData,
  Step3VisaDetailsData,
} from "@/types/apply";
import type { Step3FormValues } from "@/lib/validations/step3";

function mapSubmitError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: string }).code);
    if (code === "evfa/missing-env") {
      const detail =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message).replace(
              /^Missing Firebase web env: /,
              ""
            )
          : "";
      return `В .env не заданы переменные: ${detail}. Скопируйте все шесть полей из Firebase Console → Project settings → Your apps → веб-приложение (иконка </>). После сохранения .env перезапустите сервер: npm run dev.`;
    }
    if (code.endsWith("permission-denied")) {
      return "Доступ к базе запрещён правилами Firestore. Разрешите создание документа users/{userId} для авторизованного пользователя (совпадение uid).";
    }
    switch (code) {
      case "auth/email-already-in-use":
        return "Этот email уже зарегистрирован. Войдите или укажите другой адрес.";
      case "auth/invalid-email":
        return "Некорректный email.";
      case "auth/weak-password":
        return "Пароль слишком слабый.";
      case "auth/network-request-failed":
        return "Нет соединения с сетью. Проверьте подключение и попробуйте снова.";
      case "auth/operation-not-allowed":
        return "В Firebase не включён вход по email/паролю. Включите Email/Password в Authentication → Sign-in method.";
      case "auth/invalid-api-key":
        return "Неверный или пустой Firebase API key. Проверьте NEXT_PUBLIC_FIREBASE_* в .env и перезапустите dev-сервер.";
      case "auth/configuration-not-found":
        return "Конфиг Firebase не совпадает с проектом. Проверьте: (1) все шесть NEXT_PUBLIC_FIREBASE_* из одного веб-приложения в Firebase Console → Project settings; (2) projectId в .env совпадает с ID проекта в шапке консоли; (3) apiKey и appId не перепутаны с другим проектом; (4) authDomain вида your-project-id.firebaseapp.com; (5) после правок .env полностью перезапустите npm run dev.";
      case "unauthenticated":
        return "Запрос к Firestore без авторизации. Проверьте настройки Auth и правила Firestore.";
      case "unavailable":
        return "Сервис Firebase временно недоступен. Попробуйте позже.";
      case "invalid-argument":
        return "Некорректные данные для сохранения. Попробуйте ещё раз или обратитесь в поддержку.";
      default:
        break;
    }
  }
  return "Не удалось сохранить заявку. Попробуйте позже.";
}

export default function ApplyPage() {
  const [step, setStep] = useState<ApplyStep>(1);
  const [step1Data, setStep1Data] = useState<Step1RegistrationData | null>(null);
  const [step2Data, setStep2Data] = useState<Step2ApplicantInfoData | null>(null);
  const [step3Data, setStep3Data] = useState<Step3VisaDetailsData | null>(null);
  const [savedUserId, setSavedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFinalSubmit = async (data: Step3FormValues) => {
    if (!step1Data || !step2Data) {
      setSubmitError("Не хватает данных формы. Вернитесь к предыдущим шагам.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const user = await saveNewUserApplication(step1Data, step2Data, data);
      setStep3Data(data);
      setSavedUserId(user.uid);
      setStep("success");
    } catch (e) {
      setSubmitError(mapSubmitError(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[color:var(--background)] py-10 sm:py-12">
      <div className="container flex justify-center">
        <div className="w-full max-w-2xl rounded-2xl border border-[color:var(--border)] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 space-y-1">
            <h1 className="font-serif text-2xl font-semibold text-[color:var(--foreground)] sm:text-3xl">
              Заявка на открытие подтверждающего счёта
            </h1>
            <p className="text-xs text-[color:var(--muted)] sm:text-sm">
              Заполните форму по шагам, чтобы отправить заявку на открытие
              подтверждающего счёта.
            </p>
          </div>

          <StepIndicator currentStep={step} />

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {step === 1 && (
                  <Step1Registration
                    defaultValues={step1Data ?? undefined}
                    onNext={(data) => {
                      setStep1Data(data);
                      setStep(2);
                    }}
                  />
                )}
                {step === 2 && (
                  <Step2ApplicantInfo
                    defaultValues={step2Data ?? undefined}
                    onBack={() => setStep(1)}
                    onNext={(data) => {
                      setStep2Data(data);
                      setStep(3);
                    }}
                  />
                )}
                {step === 3 && (
                  <Step3VisaDetails
                    defaultValues={step3Data ?? undefined}
                    onBack={() => setStep(2)}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    onNext={handleFinalSubmit}
                  />
                )}
                {step === "success" && (
                  <SuccessScreen
                    userId={savedUserId ?? undefined}
                    onBackToStart={() => {
                      setStep(1);
                      setStep1Data(null);
                      setStep2Data(null);
                      setStep3Data(null);
                      setSavedUserId(null);
                      setSubmitError(null);
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

