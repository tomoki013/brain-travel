// src/lib/data/countries.ts
import type { Country } from "@/types";
import borders from "./borders.json";
import * as i18n from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";

// Register the Japanese locale
i18n.registerLocale(ja);

// Helper function to convert Alpha-2 code to a flag emoji
const getFlagEmoji = (a2Code: string): string => {
  // Regional Indicator Symbol Letter A is 0x1F1E6
  // 'A' is 0x41
  return a2Code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(char.charCodeAt(0) + 0x1f1a5),
    );
};

// Create a mapping from A3 code to Japanese name
export const countryNameJa: Record<string, string> = Object.keys(
  borders,
).reduce(
  (acc, a3) => {
    const name = i18n.getName(a3, "ja");
    if (name) {
      acc[a3] = name;
    }
    return acc;
  },
  {} as Record<string, string>,
);

// Dynamically generate the list of countries from borders.json
export const countries: Country[] = Object.keys(borders).map((a3) => {
  const a2 = i18n.alpha3ToAlpha2(a3);
  const a2Code = a2 || "--"; // Fallback for codes like 'XXK' for Kosovo
  return {
    id: a3,
    a2Code: a2Code,
    name: countryNameJa[a3] || a3,
    flag: getFlagEmoji(a2Code),
  };
});
