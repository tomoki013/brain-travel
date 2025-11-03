"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { ResultSlideshow } from "@/components/features/result/ResultSlideshow";
import borderData from "@/lib/data/borders.json";

export const ResultPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("route");
  const status = searchParams.get("status");
  const routeHistory = routeQuery ? routeQuery.split(",") : [];

  const { getCountryName } = useCountryData();
  const countryNames = routeHistory.map(getCountryName).join(" → ");

  const isGivenUp = status === "given_up";

  const startCountry = routeHistory.length > 0 ? routeHistory[0] : "";
  const goalCountry =
    routeHistory.length > 0 ? routeHistory[routeHistory.length - 1] : "";

  const countryIds = Object.keys(borderData);

  const handleRetrySame = () => {
    // startCountry and goalCountry are derived from the routeHistory query param
    if (startCountry && goalCountry) {
      router.push(`/game?start=${startCountry}&goal=${goalCountry}`);
    }
  };

  const handleRetryDifferent = () => {
    router.push("/");
  };

  const handleRetryRandom = () => {
    let randomStart, randomGoal;
    do {
      randomStart = countryIds[Math.floor(Math.random() * countryIds.length)];
      randomGoal = countryIds[Math.floor(Math.random() * countryIds.length)];
    } while (randomStart === randomGoal);
    router.push(`/game?start=${randomStart}&goal=${randomGoal}`);
  };

  const handleGoTop = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto p-8 text-center">
      <h1
        className={`text-4xl font-bold mb-4 ${
          isGivenUp ? "text-gray-700" : "text-sky-600"
        }`}
      >
        {isGivenUp ? "残念！ギブアップしました" : "クリアおめでとう！"}
      </h1>
      <p className="text-lg mb-8">
        {isGivenUp
          ? "今回の旅はここまでです。"
          : "あなたは見事、世界旅行を達成しました！"}
      </p>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">旅のルート</h2>
        <p className="text-xl font-mono bg-slate-100 p-4 rounded-lg">
          {countryNames}
        </p>
      </div>

      <ResultSlideshow routeHistory={routeHistory} />

      {/* Action Buttons */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">次の旅に出かけよう</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <button
            onClick={handleRetrySame}
            disabled={isGivenUp || !startCountry || !goalCountry}
            className="rounded-md bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            もう一度同じ設定で挑戦
          </button>
          <button
            onClick={handleRetryDifferent}
            className="rounded-md bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-teal-500"
          >
            違う設定で挑戦
          </button>
          <button
            onClick={handleRetryRandom}
            className="rounded-md bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-sky-500"
          >
            ランダムで挑戦
          </button>
          <button
            onClick={handleGoTop}
            className="rounded-md bg-gray-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-gray-500"
          >
            トップに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
