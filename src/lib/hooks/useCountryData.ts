import countryCodes from "../data/country-codes.json";
import { countries as japaneseCountries } from "../data/countries";

// Type assertion for country-codes.json
const codes = countryCodes as Record<string, { a3: string; name: string }>;

// Create a mapping from a3 to numeric id and vice-versa
const a3ToNumericId: Record<string, string> = {};
const numericIdToA3: Record<string, string> = {};

Object.keys(codes).forEach((numericId) => {
  const a3 = codes[numericId].a3;
  a3ToNumericId[a3] = numericId;
  numericIdToA3[numericId] = a3;
});

// Create a comprehensive list for searching
const allCountries = Object.values(codes).map((country) => {
  const japaneseInfo = japaneseCountries.find((c) => c.id === country.a3);
  return {
    a3: country.a3,
    englishName: country.name,
    japaneseName: japaneseInfo ? japaneseInfo.name : "",
  };
});

/**
 * Custom hook to get country-related data
 */
export const useCountryData = () => {
  /**
   * PM: Unsplash APIキーを.env.localファイルに設定してください。
   * 例: NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key
   */
  const getImageUrl = async (countryId: string): Promise<string> => {
    const localImagePath = `/images/countries/${countryId}.jpg`;
    // This check is a stub. In a real scenario, you'd check if the file exists.
    // For this project, we assume specific files exist as per original logic.
    const localImagePaths: { [key: string]: string } = {
      JPN: "/images/countries/Japan.jpg",
      FRA: "/images/countries/France.jpg",
      USA: "/images/countries/USA.jpg",
    };

    if (localImagePaths[countryId]) {
      // A proper check would be to see if the file exists on the server/public folder
      // For now, we are simulating this check.
      return localImagePaths[countryId];
    }

    const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
    if (apiKey) {
      try {
        const countryName = getCountryName(countryId);
        const query = `${countryName} landmark landscape`;
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${apiKey}`,
            },
          }
        );
        if (!response.ok) throw new Error("Unsplash API request failed");
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.regular;
        }
      } catch (error) {
        console.error("Failed to fetch image from Unsplash:", error);
      }
    }

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
  const getCountrySuggestions = (input: string): typeof allCountries => {
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

  return {
    getImageUrl,
    getCountryName,
    findCountryA3CodeByName,
    getCountrySuggestions,
  };
};
