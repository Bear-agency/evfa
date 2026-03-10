export type CountryCode = string;

export interface Country {
  code: CountryCode;
  nameRu: string;
  nameEn: string;
  flag?: string;
}

export const euCountriesRu: Country[] = [
  { code: "AT", nameRu: "Австрия", nameEn: "Austria", flag: "🇦🇹" },
  { code: "BE", nameRu: "Бельгия", nameEn: "Belgium", flag: "🇧🇪" },
  { code: "BG", nameRu: "Болгария", nameEn: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", nameRu: "Хорватия", nameEn: "Croatia", flag: "🇭🇷" },
  { code: "CY", nameRu: "Кипр", nameEn: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", nameRu: "Чехия", nameEn: "Czechia", flag: "🇨🇿" },
  { code: "DK", nameRu: "Дания", nameEn: "Denmark", flag: "🇩🇰" },
  { code: "EE", nameRu: "Эстония", nameEn: "Estonia", flag: "🇪🇪" },
  { code: "FI", nameRu: "Финляндия", nameEn: "Finland", flag: "🇫🇮" },
  { code: "FR", nameRu: "Франция", nameEn: "France", flag: "🇫🇷" },
  { code: "DE", nameRu: "Германия", nameEn: "Germany", flag: "🇩🇪" },
  { code: "GR", nameRu: "Греция", nameEn: "Greece", flag: "🇬🇷" },
  { code: "HU", nameRu: "Венгрия", nameEn: "Hungary", flag: "🇭🇺" },
  { code: "IE", nameRu: "Ирландия", nameEn: "Ireland", flag: "🇮🇪" },
  { code: "IT", nameRu: "Италия", nameEn: "Italy", flag: "🇮🇹" },
  { code: "LV", nameRu: "Латвия", nameEn: "Latvia", flag: "🇱🇻" },
  { code: "LT", nameRu: "Литва", nameEn: "Lithuania", flag: "🇱🇹" },
  { code: "LU", nameRu: "Люксембург", nameEn: "Luxembourg", flag: "🇱🇺" },
  { code: "MT", nameRu: "Мальта", nameEn: "Malta", flag: "🇲🇹" },
  { code: "NL", nameRu: "Нидерланды", nameEn: "Netherlands", flag: "🇳🇱" },
  { code: "PL", nameRu: "Польша", nameEn: "Poland", flag: "🇵🇱" },
  { code: "PT", nameRu: "Португалия", nameEn: "Portugal", flag: "🇵🇹" },
  { code: "RO", nameRu: "Румыния", nameEn: "Romania", flag: "🇷🇴" },
  { code: "SK", nameRu: "Словакия", nameEn: "Slovakia", flag: "🇸🇰" },
  { code: "SI", nameRu: "Словения", nameEn: "Slovenia", flag: "🇸🇮" },
  { code: "ES", nameRu: "Испания", nameEn: "Spain", flag: "🇪🇸" },
  { code: "SE", nameRu: "Швеция", nameEn: "Sweden", flag: "🇸🇪" },
];

// simple full-country list stub (can be expanded later)
export const allCountries: Country[] = [
  { code: "RU", nameRu: "Россия", nameEn: "Russia", flag: "🇷🇺" },
  { code: "UA", nameRu: "Украина", nameEn: "Ukraine", flag: "🇺🇦" },
  { code: "KZ", nameRu: "Казахстан", nameEn: "Kazakhstan", flag: "🇰🇿" },
  { code: "GE", nameRu: "Грузия", nameEn: "Georgia", flag: "🇬🇪" },
  { code: "AM", nameRu: "Армения", nameEn: "Armenia", flag: "🇦🇲" },
  { code: "TR", nameRu: "Турция", nameEn: "Türkiye", flag: "🇹🇷" },
  { code: "AE", nameRu: "ОАЭ", nameEn: "United Arab Emirates", flag: "🇦🇪" },
  { code: "DE", nameRu: "Германия", nameEn: "Germany", flag: "🇩🇪" },
  { code: "FR", nameRu: "Франция", nameEn: "France", flag: "🇫🇷" },
  { code: "ES", nameRu: "Испания", nameEn: "Spain", flag: "🇪🇸" },
  { code: "IT", nameRu: "Италия", nameEn: "Italy", flag: "🇮🇹" },
  { code: "PL", nameRu: "Польша", nameEn: "Poland", flag: "🇵🇱" },
  { code: "CZ", nameRu: "Чехия", nameEn: "Czechia", flag: "🇨🇿" },
  { code: "US", nameRu: "США", nameEn: "United States", flag: "🇺🇸" },
  { code: "GB", nameRu: "Великобритания", nameEn: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", nameRu: "Канада", nameEn: "Canada", flag: "🇨🇦" },
  { code: "CN", nameRu: "Китай", nameEn: "China", flag: "🇨🇳" },
  { code: "IN", nameRu: "Индия", nameEn: "India", flag: "🇮🇳" },
];

// Международные телефонные коды (упрощённый список для используемых стран)
export const countryPhoneCodes: Record<CountryCode, string> = {
  RU: "+7",
  UA: "+380",
  KZ: "+7",
  GE: "+995",
  AM: "+374",
  TR: "+90",
  AE: "+971",
  DE: "+49",
  FR: "+33",
  ES: "+34",
  IT: "+39",
  PL: "+48",
  CZ: "+420",
  US: "+1",
  GB: "+44",
  CA: "+1",
  CN: "+86",
  IN: "+91",
  // ЕС 27
  AT: "+43",
  BE: "+32",
  BG: "+359",
  HR: "+385",
  CY: "+357",
  DK: "+45",
  EE: "+372",
  FI: "+358",
  GR: "+30",
  HU: "+36",
  IE: "+353",
  LV: "+371",
  LT: "+370",
  LU: "+352",
  MT: "+356",
  NL: "+31",
  PT: "+351",
  RO: "+40",
  SK: "+421",
  SI: "+386",
  SE: "+46",
};


