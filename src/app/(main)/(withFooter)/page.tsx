"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { CountryModal } from "@/components/features/shared/CountryModal";
import { useCountryData } from "@/lib/hooks/useCountryData";
import type { Country } from "@/types";

export default function TopPage() {
  const router = useRouter();
  const { getPlayableCountries, getCountriesInSameContinent, countries } =
    useCountryData();

  const [startCountry, setStartCountry] = useState<Country | null>(null);
  const [goalCountry, setGoalCountry] = useState<Country | null>(null);

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const handleStartRandom = () => {
    const playable = getPlayableCountries();
    if (playable.length === 0) return;

    const randomStart = playable[Math.floor(Math.random() * playable.length)];
    const continentPeers = getCountriesInSameContinent(randomStart.id).filter(
      (c) => c.id !== randomStart.id
    );

    if (continentPeers.length > 0) {
      const randomGoal =
        continentPeers[Math.floor(Math.random() * continentPeers.length)];
      router.push(`/game?start=${randomStart.id}&goal=${randomGoal.id}`);
    } else {
      // Fallback if no peers found, though getPlayableCountries should prevent this
      handleStartRandom();
    }
  };

  const handleSelectStart = (country: Country) => {
    setStartCountry(country);
    setGoalCountry(null); // Reset goal when start changes
  };

  const goalCountries = useMemo(() => {
    if (!startCountry) return [];
    return getCountriesInSameContinent(startCountry.id);
  }, [startCountry, getCountriesInSameContinent]);

  const handleStartGame = () => {
    if (startCountry && goalCountry) {
      router.push(
        `/game?start=${startCountry.id}&goal=${goalCountry.id}`
      );
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
          <motion.button
            onClick={handleStartRandom}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-md bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            ランダムで旅を始める
          </motion.button>
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
            <motion.button
              onClick={() => setIsStartModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-md bg-neutral-800/80 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-neutral-700/90"
            >
              {startCountry ? startCountry.name : "スタート国を選択"}
            </motion.button>
            <motion.button
              onClick={() => setIsGoalModalOpen(true)}
              disabled={!startCountry}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-md bg-neutral-800/80 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-neutral-700/90 disabled:cursor-not-allowed disabled:bg-neutral-800/50 disabled:text-gray-400"
            >
              {goalCountry ? goalCountry.name : "ゴール国を選択"}
            </motion.button>
          </div>
          <div className="mt-8">
            <motion.button
              onClick={handleStartGame}
              disabled={!startCountry || !goalCountry}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-md bg-white px-4 py-3 text-base font-semibold text-black shadow-lg transition hover:bg-gray-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-gray-600/50 disabled:text-gray-400"
            >
              ゲーム開始
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <CountryModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        title="スタート国を選択"
        availableCountries={getPlayableCountries()}
        onSelect={handleSelectStart}
      />
      <CountryModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="ゴール国を選択"
        availableCountries={goalCountries}
        onSelect={setGoalCountry}
      />
    </main>
  );
}
