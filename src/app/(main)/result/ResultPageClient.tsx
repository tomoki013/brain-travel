"use client";

import { useSearchParams } from "next/navigation";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { ResultSlideshow } from "@/components/features/result/ResultSlideshow";

export const ResultPageClient = () => {
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("route");
  const routeHistory = routeQuery ? routeQuery.split(",") : [];

  const { getCountryName } = useCountryData();
  const countryNames = routeHistory.map(getCountryName).join(" → ");

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold text-sky-600 mb-4">
        クリアおめでとう！
      </h1>
      <p className="text-lg mb-8">
        あなたは見事、世界旅行を達成しました！
      </p>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">旅のルート</h2>
        <p className="text-xl font-mono bg-slate-100 p-4 rounded-lg">
          {countryNames}
        </p>
      </div>

      <ResultSlideshow routeHistory={routeHistory} />
    </div>
  );
};
