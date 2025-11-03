"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { ResultSlideshow } from "@/components/features/result/ResultSlideshow";

export const ResultPageClient = () => {
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("route");
  const status = searchParams.get("status");
  const routeHistory = routeQuery ? routeQuery.split(",") : [];

  const { getCountryName } = useCountryData();
  const countryNames = routeHistory.map(getCountryName).join(" → ");

  const isGivenUp = status === "given_up";

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

      <div className="mt-12">
        <Link
          href="/"
          className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
};
