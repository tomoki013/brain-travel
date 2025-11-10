"use client";

import { useCountryData } from "@/lib/hooks/useCountryData";
import type { Country } from "@/types";

type ItineraryDisplayProps = {
  routeHistory: string[];
  startCountry: string | null;
  goalCountry: string | null;
};

export const ItineraryDisplay = ({
  routeHistory,
  startCountry,
  goalCountry,
}: ItineraryDisplayProps) => {
  const { getCountryName } = useCountryData();

  const start = getCountryName(startCountry);
  const goal = getCountryName(goalCountry);

  return (
    <div className="absolute top-4 left-4 z-10 w-80 rounded-lg bg-black/50 p-4 text-white shadow-lg backdrop-blur-md">
      <div className="mb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">
          旅のルート
        </h2>
        <p className="mt-1 truncate text-lg">
          <span className="font-bold">{start}</span>
          <span className="mx-2">→</span>
          <span className="font-bold">{goal}</span>
        </p>
      </div>
      <div className="max-h-60 overflow-y-auto">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-white/60">
          移動履歴
        </h3>
        <ul className="space-y-2 text-sm">
          {routeHistory.map((countryId, index) => (
            <li key={`${countryId}-${index}`} className="flex items-baseline">
              <span className="mr-3 font-mono text-white/60">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <span className="font-semibold">{getCountryName(countryId)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
