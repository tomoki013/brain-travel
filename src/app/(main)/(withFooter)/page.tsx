"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CountryImage } from "@/components/features/game/CountryImage";
import { countries } from "@/lib/data/countries";
import borderData from "@/lib/data/borders.json";

export default function TopPage() {
  const router = useRouter();
  const [startCountry, setStartCountry] = useState(countries[0].id);
  const [goalCountry, setGoalCountry] = useState(countries[1].id);
  const [error, setError] = useState<string | null>(null);

  const countryBorders = borderData as Record<string, string[]>;
  const countryIds = Object.keys(countryBorders);

  // Generate a random country ID for the background on initial render only
  const [randomBgCountryId] = useState(() => {
    if (countryIds.length === 0) return "";
    return countryIds[Math.floor(Math.random() * countryIds.length)];
  });

  const handleStartRandom = () => {
    let randomStart, randomGoal;
    do {
      randomStart = countryIds[Math.floor(Math.random() * countryIds.length)];
      randomGoal = countryIds[Math.floor(Math.random() * countryIds.length)];
    } while (randomStart === randomGoal);
    router.push(`/game?start=${randomStart}&goal=${randomGoal}`);
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
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                スタート国
              </label>
              <select
                id="start-country"
                name="start-country"
                value={startCountry}
                onChange={(e) => setStartCountry(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="goal-country"
                className="block text-sm font-medium leading-6 text-gray-200"
              >
                ゴール国
              </label>
              <select
                id="goal-country"
                name="goal-country"
                value={goalCountry}
                onChange={(e) => setGoalCountry(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
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
