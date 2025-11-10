// src/lib/data/countries.ts
import type { Country } from "@/types";
import borders from "./borders.json";
import * as i18n from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";

// Register the Japanese locale
i18n.registerLocale(ja);

// Create a mapping from A3 code to Japanese name
export const countryNameJa: Record<string, string> = Object.keys(
  borders,
).reduce(
  (acc, a3) => {
    // The library uses uppercase Alpha-3 codes.
    const name = i18n.getName(a3, "ja");
    if (name) {
      acc[a3] = name;
    } else {
      // Fallback for codes that might not be found, e.g., XKX for Kosovo
      // console.warn(`Japanese name not found for A3 code: ${a3}`);
    }
    return acc;
  },
  {} as Record<string, string>,
);

// Dynamically generate the list of countries from borders.json
export const countries: Country[] = Object.keys(borders).map((a3) => ({
  id: a3,
  // Use the Japanese name if available, otherwise fallback to the A3 code.
  name: countryNameJa[a3] || a3,
}));
