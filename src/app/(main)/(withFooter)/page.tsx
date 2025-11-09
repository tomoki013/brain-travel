"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCountryData } from "@/lib/hooks/useCountryData";
import Image from "next/image";

export default function TopPage() {
  const router = useRouter();
  const { getPlayableCountries, getCountriesInSameContinent, countries } =
    useCountryData();
  const [startCountry, setStartCountry] = useState<string | null>(null);
  const [goalCountry, setGoalCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playableCountries = useMemo(
    () => getPlayableCountries(),
    [getPlayableCountries]
  );
  const goalCountries = useMemo(() => {
    if (!startCountry) return [];
    const sameContinentA3s = getCountriesInSameContinent(startCountry);
    return countries.filter(
      (c) => sameContinentA3s.includes(c.id) && c.id !== startCountry
    );
  }, [startCountry, countries, getCountriesInSameContinent]);

  const handleStartRandom = () => {
    setError(null);
    if (playableCountries.length === 0) {
      setError("プレイ可能な国が見つかりませんでした。");
      return;
    }

    // 1. プレイ可能な国からランダムにスタート国を選択
    const start =
      playableCountries[Math.floor(Math.random() * playableCountries.length)];

    // 2. スタート国と同じ大陸に属する国を取得
    const continentPeers = getCountriesInSameContinent(start.id);

    // 3. スタート国自身を除いたリストから、ランダムにゴール国を選択
    const possibleGoals = continentPeers.filter((id) => id !== start.id);

    if (possibleGoals.length === 0) {
      // このケースは`getPlayableCountries`のロジックが正しければ発生しないはずですが、
      // 安全のためエラーハンドリングを行います。
      setError("適切なゴール国が見つかりませんでした。もう一度お試しください。");
      return;
    }

    const goal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];

    // 4. ゲームページに遷移
    router.push(`/game?start=${start.id}&goal=${goal}`);
  };

  const handleStartSelected = () => {
    if (startCountry && goalCountry && startCountry !== goalCountry) {
      setError(null);
      router.push(`/game?start=${startCountry}&goal=${goalCountry}`);
    } else {
      setError("スタート国とゴール国は異なる国を選択してください。");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Image */}
      <div className={`absolute inset-0 z-0`}>
        <Image
          src={`/images/default-globe.jpg`}
          alt={`壮大な地球の画像`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content Overlay */}
      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          variants={itemVariants}
        >
          Geo Linker
        </motion.h1>
        <motion.p
          className="mt-6 text-lg leading-8 text-gray-200"
          variants={itemVariants}
        >
          スタート国とゴール国を選んで、旅に出かけよう！
        </motion.p>

        {/* Random Start */}
        <motion.div className="mt-10" variants={itemVariants}>
          <button
            onClick={handleStartRandom}
            className="rounded-md bg-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            ランダムで旅を始める
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div className="my-8 flex items-center" variants={itemVariants}>
          <div className="grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-300">OR</span>
          <div className="grow border-t border-gray-400"></div>
        </motion.div>

        {/* Selected Start */}
        <motion.div
          className="rounded-lg bg-white/10 p-8 shadow-xl backdrop-blur-md"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            自分で国を選んで旅する
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-country"
                className="block text-sm font-medium leading-6 text-gray-200 text-left"
              >
                スタート国
              </label>
              <div className="mt-2">
                <select
                  id="start-country"
                  value={startCountry ?? ""}
                  onChange={(e) => {
                    setStartCountry(e.target.value || null);
                    setGoalCountry(null); // Reset goal country when start changes
                  }}
                  className="block w-full rounded-md border-0 bg-white/10 py-2 pl-3 pr-10 text-white ring-1 ring-inset ring-white/30 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                >
                  <option value="">選択してください</option>
                  {playableCountries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="goal-country"
                className="block text-sm font-medium leading-6 text-gray-200 text-left"
              >
                ゴール国
              </label>
              <div className="mt-2">
                <select
                  id="goal-country"
                  value={goalCountry ?? ""}
                  onChange={(e) => setGoalCountry(e.target.value || null)}
                  disabled={!startCountry}
                  className="block w-full rounded-md border-0 bg-white/10 py-2 pl-3 pr-10 text-white ring-1 ring-inset ring-white/30 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-gray-400"
                >
                  <option value="">選択してください</option>
                  {goalCountries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-8">
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <button
              onClick={handleStartSelected}
              className="w-full rounded-md bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              この国で旅を始める
            </button>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
