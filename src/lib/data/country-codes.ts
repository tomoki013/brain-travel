import countryCodes from "./country-codes.json";

type CountryCodes = {
  [key: string]: {
    a3: string;
    name: string;
  };
};

const typedCountryCodes: CountryCodes = countryCodes;

export const a3ToNumericId: { [key: string]: string } = Object.entries(
  typedCountryCodes,
).reduce(
  (acc, [numericId, data]) => {
    acc[data.a3] = numericId;
    return acc;
  },
  {} as { [key: string]: string },
);
