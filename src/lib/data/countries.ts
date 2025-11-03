// src/lib/data/countries.ts

import type { Country } from "@/types";
import borders from "./borders.json";
import countryCodes from "./country-codes.json";

// Create a mapping from A3 code to Japanese name
const countryNameMap: Record<string, string> = Object.values(countryCodes).reduce(
  (acc, info) => {
    // There is no Japanese name in country-codes.json, so I will use English name instead
    acc[info.a3] = info.name;
    return acc;
  },
  {} as Record<string, string>
);

// Dynamically generate the list of countries from borders.json
export const countries: Country[] = Object.keys(borders).map((a3) => ({
  id: a3,
  name: countryNameMap[a3] || a3,
}));
