export type ApplyStep = 1 | 2 | 3 | 4 | "success";

// Keep in sync with lib/validations/step1
import type { Step1FormValues } from "@/lib/validations/step1";
export type Step1RegistrationData = Step1FormValues;

export interface Step2ApplicantInfoData {
  birthDate: string;
  citizenship: string;
  residenceCountry: string;
  taxResidency: string;
  phone: string;
  hasSecondCitizenship: boolean;
  secondCitizenship?: string;
  hasResidencePermit: boolean;
  residencePermitCountry?: string;
}

export type VisaType =
  | "student"
  | "work"
  | "family"
  | "research"
  | "entrepreneur";

export interface Step3VisaDetailsData {
  destinationCountry: string;
  visaType: VisaType;
}

export interface UploadedFilePreview {
  file: File;
  previewUrl?: string;
}

export interface Step4DocumentsData {
  passport: UploadedFilePreview | null;
  registrationPage: UploadedFilePreview | null;
  selfie: UploadedFilePreview | null;
  video: UploadedFilePreview | null;
}

