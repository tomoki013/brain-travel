// src/lib/data/localImageManifest.ts

/**
 * A set of country IDs (A3 codes) for which local images are available.
 * This is used by the useCountryData hook to determine whether to serve a local image
 * or fetch one from an external API.
 * The file names are expected to be in the format `${countryId}.jpg`.
 */
export const localImageManifest = new Set<string>([
  "FRA",
  "BEL",
  "EGY",
  "GRC",
  "IND",
  "KOR",
  "ESP",
  "THA",
  "TUR",
  "VNM",
  "JPN",
]);
