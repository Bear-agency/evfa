"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepIndicator } from "@/components/apply/StepIndicator";
import { Step1Registration } from "@/components/apply/Step1Registration";
import { Step2ApplicantInfo } from "@/components/apply/Step2ApplicantInfo";
import { Step3VisaDetails } from "@/components/apply/Step3VisaDetails";
import { SuccessScreen } from "@/components/apply/SuccessScreen";
import type {
  ApplyStep,
  Step1RegistrationData,
  Step2ApplicantInfoData,
  Step3VisaDetailsData,
} from "@/types/apply";

export default function ApplyPage() {
  const [step, setStep] = useState<ApplyStep>(1);
  const [step1Data, setStep1Data] = useState<Step1RegistrationData | null>(null);
  const [step2Data, setStep2Data] = useState<Step2ApplicantInfoData | null>(null);
  const [step3Data, setStep3Data] = useState<Step3VisaDetailsData | null>(null);

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
                      console.log("Wizard data so far", { step1Data, step2Data: data });
                    }}
                  />
                )}
                {step === 3 && (
                  <Step3VisaDetails
                    defaultValues={step3Data ?? undefined}
                    onBack={() => setStep(2)}
                    onNext={(data) => {
                      setStep3Data(data);
                      console.log("Wizard data so far", {
                        step1Data,
                        step2Data,
                        step3Data: data,
                      });
                      setStep("success");
                    }}
                  />
                )}
                {step === "success" && (
                  <SuccessScreen
                    onBackToStart={() => {
                      setStep(1);
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

