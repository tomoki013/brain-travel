"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shuffle, MapPin, Play } from "lucide-react";
import { CountryModal } from "@/components/features/shared/CountryModal";
import { useCountryData } from "@/lib/hooks/useCountryData";
import type { Country } from "@/types";
import { Button } from "@/components/ui/Button";

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
      (c) => c.id !== randomStart.id,
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
      router.push(`/game?start=${startCountry.id}&goal=${goalCountry.id}`);
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
          <Button
            onClick={handleStartRandom}
            variant="secondary"
            size="lg"
            className="text-lg"
          >
            <Shuffle className="mr-3 h-5 w-5" />
            ランダムで旅を始める
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div className="my-8 flex items-center" variants={itemVariants}>
          <div className="grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-300">OR</span>
          <div className="grow border-t border-gray-400"></div>
        </motion.div>

        {/* Selected Start */}
        <motion.div
          className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-xl backdrop-blur-md"
          variants={itemVariants}
        >
          <h2 className="mb-6 text-2xl font-semibold text-white">
            自分で国を選んで旅する
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              onClick={() => setIsStartModalOpen(true)}
              variant="glass"
              className="justify-start"
            >
              <MapPin className="mr-3 h-5 w-5 text-neutral-400" />
              {startCountry ? startCountry.name : "スタート国を選択"}
            </Button>
            <Button
              onClick={() => setIsGoalModalOpen(true)}
              disabled={!startCountry}
              variant="glass"
              className="justify-start"
            >
              <MapPin className="mr-3 h-5 w-5 text-neutral-400" />
              {goalCountry ? goalCountry.name : "ゴール国を選択"}
            </Button>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleStartGame}
              disabled={!startCountry || !goalCountry}
              className="w-full"
              size="lg"
            >
              <Play className="mr-3 h-5 w-5" />
              ゲーム開始
            </Button>
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
