"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CountryImage } from "@/components/features/game/CountryImage";
import { CountrySelector } from "@/components/features/shared/CountrySelector";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { Country } from "@/types";

export default function TopPage() {
  const router = useRouter();
  const { getPlayableCountries, getCountriesInSameContinent, countries } =
    useCountryData();
  const [startCountry, setStartCountry] = useState<string | null>(null);
  const [goalCountry, setGoalCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playableCountries = useMemo(() => getPlayableCountries(), []);
  const goalCountries = useMemo(() => {
    if (!startCountry) return [];
    const sameContinentA3s = getCountriesInSameContinent(startCountry);
    return countries.filter(
      (c) => sameContinentA3s.includes(c.id) && c.id !== startCountry
    );
  }, [startCountry, countries]);

  // Generate a random country ID for the background on initial render only
  const [randomBgCountryId] = useState(() => {
    if (countries.length === 0) return "";
    return countries[Math.floor(Math.random() * countries.length)].id;
  });

  const handleStartRandom = () => {
    // 1. Pick a random start country from the playable list
    const randomStartCountry =
      playableCountries[Math.floor(Math.random() * playableCountries.length)];

    // 2. Get the list of countries in the same continent
    const continentPeers = getCountriesInSameContinent(randomStartCountry.id);
    const validGoalCountries = continentPeers.filter(
      (id) => id !== randomStartCountry.id
    );

    // 3. Pick a random goal country from that list
    const randomGoalCountryId =
      validGoalCountries[
        Math.floor(Math.random() * validGoalCountries.length)
      ];

    router.push(
      `/game?start=${randomStartCountry.id}&goal=${randomGoalCountryId}`
    );
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
      <CountryImage
        countryId={randomBgCountryId}
        className="absolute inset-0 z-0"
      />
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
          脳内世界旅行
        </motion.h1>
        <motion.p
          className="mt-6 text-lg leading-8 text-gray-200"
          variants={itemVariants}
        >
          スタート国とゴール国を選んで、脳内旅行に出かけよう！
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
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-300">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
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
                <CountrySelector
                  id="start-country"
                  value={startCountry}
                  onChange={(countryId) => {
                    setStartCountry(countryId);
                    setGoalCountry(null); // Reset goal country when start changes
                  }}
                  countriesList={playableCountries}
                />
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
                <CountrySelector
                  id="goal-country"
                  value={goalCountry}
                  onChange={setGoalCountry}
                  countriesList={goalCountries}
                  disabled={!startCountry}
                />
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
