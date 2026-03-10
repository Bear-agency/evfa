import { Progress } from "@/components/ui/progress";
import type { ApplyStep } from "@/types/apply";

const labels: Record<Exclude<ApplyStep, "success">, string> = {
  1: "Регистрация",
  2: "Данные заявителя",
  3: "Параметры визы",
  4: "Документы (KYC)",
};

interface StepIndicatorProps {
  currentStep: ApplyStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const numericStep = currentStep === "success" ? 4 : currentStep;
  const progress = (numericStep / 4) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
        <span>
          Шаг {numericStep} из 4 —{" "}
          <span className="font-medium text-[color:var(--foreground)]">
            {labels[numericStep]}
          </span>
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}

