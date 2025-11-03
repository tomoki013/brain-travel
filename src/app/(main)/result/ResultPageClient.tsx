"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { ResultSlideshow } from "@/components/features/result/ResultSlideshow";
import { CountryImage } from "@/components/features/game/CountryImage";
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
  const bgCountryId = isGivenUp
    ? startCountry
    : goalCountry || startCountry;

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

  const MotionButton = motion.button;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8 overflow-hidden text-white">
      {/* Background Image */}
      {bgCountryId && (
        <CountryImage
          countryId={bgCountryId}
          className="absolute inset-0 z-0"
        />
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1
          className={`text-4xl sm:text-5xl font-bold mb-4 ${
            isGivenUp ? "text-gray-300" : "text-cyan-300"
          }`}
        >
          {isGivenUp ? "残念！ギブアップしました" : "クリアおめでとう！"}
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          {isGivenUp
            ? "今回の旅はここまでです。"
            : "あなたは見事、世界旅行を達成しました！"}
        </p>

        <div className="mb-12 rounded-lg bg-white/10 p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100">
            旅のルート
          </h2>
          <p className="text-base sm:text-xl font-mono text-yellow-200 p-2 sm:p-4 rounded-lg">
            {countryNames}
          </p>
        </div>

        <div className="w-full aspect-video max-w-2xl mx-auto mb-12">
          <ResultSlideshow routeHistory={routeHistory} />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 border-t border-gray-600 pt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100">
            次の旅に出かけよう
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <MotionButton
              onClick={handleRetrySame}
              disabled={isGivenUp || !startCountry || !goalCountry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              もう一度同じ設定で挑戦
            </MotionButton>
            <MotionButton
              onClick={handleRetryDifferent}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-teal-500"
            >
              違う設定で挑戦
            </MotionButton>
            <MotionButton
              onClick={handleRetryRandom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-sky-500"
            >
              ランダムで挑戦
            </MotionButton>
            <MotionButton
              onClick={handleGoTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-gray-700 px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-gray-600"
            >
              トップに戻る
            </MotionButton>
          </div>
        </div>
      </div>
    </div>
  );
};
