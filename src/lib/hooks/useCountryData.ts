import { useCallback, useMemo } from "react";
import countryCodes from "../data/country-codes.json";
import { a3ToNumericId } from "../data/country-codes";
import { countryNameJa } from "../data/countries";
import { localImageManifest } from "../data/localImageManifest";
import { continentMap } from "../data/continentMapping";
import { Country } from "@/types";
import * as i18n from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json";

i18n.registerLocale(ja);

// Type assertion for country-codes.json
const codes = countryCodes as Record<string, { a3: string; name: string }>;

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
  const getCountryName = useCallback((countryId: string | null): string => {
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
  }, []);

  const getImageUrl = useCallback(
    async (countryId: string): Promise<string> => {
      // Priority 1: Check local manifest first, regardless of API key.
      if (localImageManifest.has(countryId)) {
        return `/images/countries/${countryId}.jpg`;
      }

      // Priority 2: Check cache
      if (imageCache.has(countryId)) {
        return imageCache.get(countryId)!;
      }

      // Priority 3: Attempt to fetch from Unsplash API ONLY if a key is provided.
      const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      if (!apiKey) {
        // If no API key, and not a local image, return default immediately.
        return "/images/default-globe.jpg";
      }

      try {
        const countryName = getCountryName(countryId);
        const query = `${countryName} landmark landscape`;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            query,
          )}&orientation=landscape&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${apiKey}`,
            },
          },
        );

        if (!response.ok) {
          console.error(`Unsplash API request failed: ${response.statusText}`);
          // Don't throw, just fall through to the default image.
        } else {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            // Save to cache on success
            imageCache.set(countryId, imageUrl);
            return imageUrl;
          }
        }
      } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
      }

      // Final fallback: Return default image if API fails or returns no results.
      return "/images/default-globe.jpg";
    },
    [getCountryName],
  );

  const findCountryA3CodeByName = useCallback((name: string): string | null => {
    const normalizedInput = name.trim().toLowerCase();
    const found = allCountries.find(
      (c) =>
        c.a3.toLowerCase() === normalizedInput ||
        c.englishName.toLowerCase() === normalizedInput ||
        (c.japaneseName && c.japaneseName.toLowerCase() === normalizedInput),
    );
    return found ? found.a3 : null;
  }, []);

  const getCountrySuggestions = useCallback(
    (
      input: string,
    ): { a3: string; englishName: string; japaneseName: string }[] => {
      const normalizedInput = input.trim().toLowerCase();
      if (!normalizedInput) return [];
      return allCountries
        .filter(
          (c) =>
            c.a3.toLowerCase().startsWith(normalizedInput) ||
            c.englishName.toLowerCase().startsWith(normalizedInput) ||
            (c.japaneseName &&
              c.japaneseName.toLowerCase().startsWith(normalizedInput)),
        )
        .slice(0, 5); // Return top 5 matches
    },
    [],
  );

  const getFlagEmoji = (a2Code: string): string => {
    return a2Code
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(char.charCodeAt(0) + 0x1f1a5),
      );
  };

  const countries: Country[] = useMemo(() => {
    return allCountries.map((c) => {
      const a2 = i18n.alpha3ToAlpha2(c.a3);
      const a2Code = a2 || "--";
      return {
        id: c.a3,
        a2Code: a2Code,
        name: c.japaneseName || c.englishName,
        flag: getFlagEmoji(a2Code),
      };
    });
  }, []);

  const getCountriesInSameContinent = useCallback(
    (a3Code: string): Country[] => {
      const continentId = continentMap[a3Code];
      if (continentId === undefined) {
        return [];
      }
      const continentA3Codes = Object.keys(continentMap).filter(
        (key) => continentMap[key] === continentId,
      );
      return countries.filter((country) =>
        continentA3Codes.includes(country.id),
      );
    },
    [countries],
  );

  const getPlayableCountries = useCallback((): Country[] => {
    const continentCounts = Object.values(continentMap).reduce(
      (acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const playableA3Codes = Object.keys(continentMap).filter((a3) => {
      const continentId = continentMap[a3];
      return continentCounts[continentId] > 1;
    });

    return countries.filter((country) => playableA3Codes.includes(country.id));
  }, [countries]);

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
