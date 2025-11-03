import countryCodes from '../data/country-codes.json';

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

/**
 * Custom hook to get country-related data
 */
export const useCountryData = () => {
  /**
   * Gets the photo URL based on the country ID
   * @param countryId Country ID (ISO 3166-1 alpha-3)
   * @returns Photo URL
   */
  const getImageUrl = (countryId: string): string => {
    // This is a placeholder. A more robust solution would be needed in a real app.
    if (countryId === 'JPN') {
      return '/images/countries/Japan.jpg';
    }
    if (countryId === 'FRA') {
      return '/images/countries/France.jpg';
    }
    if (countryId === 'USA') {
      return '/images/countries/USA.jpg';
    }

    // TODO: Implement API fetch from Unsplash or another service

    // Return default image if no local photo is found
    return '/default-globe.jpg';
  };

  /**
   * Gets the country name based on the country ID
   * @param countryId Country ID (ISO 3166-1 alpha-3)
   * @returns Country name
   */
  const getCountryName = (countryId: string | null): string => {
    if (!countryId) {
      return 'N/A';
    }
    const numericId = a3ToNumericId[countryId];
    if (numericId && codes[numericId]) {
      return codes[numericId].name;
    }
    return countryId; // Fallback to id if name not found
  };

  return { getImageUrl, getCountryName };
};
