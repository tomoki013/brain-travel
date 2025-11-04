import countryCodes from "../data/country-codes.json";
import { countryNameJa } from "../data/countries";
import { localImageManifest } from "../data/localImageManifest";
import { continentMap } from "../data/continentMapping";
import { Country } from "@/types";

// Type assertion for country-codes.json
const codes = countryCodes as Record<string, { a3: string; name: string }>;

// Create a mapping from a3 to numeric id and vice-versa
export const a3ToNumericId: Record<string, string> = {};
const numericIdToA3: Record<string, string> = {};

Object.keys(codes).forEach((numericId) => {
  const a3 = codes[numericId].a3;
  a3ToNumericId[a3] = numericId;
  numericIdToA3[numericId] = a3;
});

// Create a comprehensive list for searching
const allCountries = Object.values(codes).map((country) => {
  return {
    a3: country.a3,
    englishName: country.name,
    japaneseName: countryNameJa[country.a3] || "",
  };
});

// Cache for API results
const imageCache = new Map<string, string>();

/**
 * Custom hook to get country-related data
 */
export const useCountryData = () => {
  /**
   * PM: Unsplash APIキーを.env.localファイルに設定してください。
   * 例: NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key
   */
  const getImageUrl = async (countryId: string): Promise<string> => {
    // Priority 1: Check local manifest
    if (localImageManifest.has(countryId)) {
      return `/images/countries/${countryId}.jpg`;
    }

    // Priority 2: Check cache
    if (imageCache.has(countryId)) {
      return imageCache.get(countryId)!;
    }

    // Priority 3: Fetch from Unsplash API
    const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if (apiKey) {
      try {
        const countryName = getCountryName(countryId);
        const query = `${countryName} landmark landscape`;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query
          )}&orientation=landscape&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${apiKey}`,
            },
          }
        );
        if (!response.ok) throw new Error("Unsplash API request failed");
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const imageUrl = data.results[0].urls.regular;
          // Priority 4: Save to cache
          imageCache.set(countryId, imageUrl);
          return imageUrl;
        }
      } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
      }
    }

    // Priority 5: Return default image
    return "/default-globe.jpg";
  };

  /**
   * Gets the country name based on the country ID
   * @param countryId Country ID (ISO 3166-1 alpha-3)
   * @returns Country name
   */
  const getCountryName = (countryId: string | null): string => {
    if (!countryId) {
      return "N/A";
    }
    // Prioritize Japanese name
    if (countryNameJa[countryId]) {
      return countryNameJa[countryId];
    }
    // Fallback to English name
    const numericId = a3ToNumericId[countryId];
    if (numericId && codes[numericId]) {
      return codes[numericId].name;
    }
    return countryId; // Fallback to id if name not found
  };

  /**
   * Finds a country's A3 code by its name (English, Japanese, or A3 code).
   * @param name The name or code to search for.
   * @returns The A3 code or null if not found.
   */
  const findCountryA3CodeByName = (name: string): string | null => {
    const normalizedInput = name.trim().toLowerCase();
    const found = allCountries.find(
      (c) =>
        c.a3.toLowerCase() === normalizedInput ||
        c.englishName.toLowerCase() === normalizedInput ||
        (c.japaneseName && c.japaneseName.toLowerCase() === normalizedInput)
    );
    return found ? found.a3 : null;
  };

  /**
   * Gets a list of country suggestions based on the input string.
   * @param input The string to search for.
   * @returns A list of suggested countries.
   */
  const getCountrySuggestions = (
    input: string
  ): { a3: string; englishName: string; japaneseName: string }[] => {
    const normalizedInput = input.trim().toLowerCase();
    if (!normalizedInput) return [];
    return allCountries
      .filter(
        (c) =>
          c.a3.toLowerCase().startsWith(normalizedInput) ||
          c.englishName.toLowerCase().startsWith(normalizedInput) ||
          (c.japaneseName &&
            c.japaneseName.toLowerCase().startsWith(normalizedInput))
      )
      .slice(0, 5); // Return top 5 matches
  };

  const countries: Country[] = allCountries.map((c) => ({
    id: c.a3,
    name: c.japaneseName || c.englishName,
  }));

  /**
   * Gets a list of country A3 codes in the same continent as the given A3 code.
   * @param a3Code The A3 code of the country.
   * @returns An array of A3 codes.
   */
  const getCountriesInSameContinent = (a3Code: string): string[] => {
    const continentId = continentMap[a3Code];
    if (continentId === undefined) {
      return [];
    }
    return Object.keys(continentMap).filter(
      (key) => continentMap[key] === continentId
    );
  };

  /**
   * Gets a list of countries that are not isolated (i.e., have land borders).
   * @returns An array of Country objects.
   */
  const getPlayableCountries = (): Country[] => {
    // Count how many countries are in each continent chunk
    const continentCounts = Object.values(continentMap).reduce(
      (acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    // Filter out countries that are in a continent chunk of size 1 (isolated)
    const playableA3Codes = Object.keys(continentMap).filter((a3) => {
      const continentId = continentMap[a3];
      return continentCounts[continentId] > 1;
    });

    return countries.filter((country) => playableA3Codes.includes(country.id));
  };

  return {
    getImageUrl,
    getCountryName,
    findCountryA3CodeByName,
    getCountrySuggestions,
    countries,
    getCountriesInSameContinent,
    getPlayableCountries,
  };
};
