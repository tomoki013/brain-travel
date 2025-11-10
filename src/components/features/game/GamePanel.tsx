"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Map, Skull } from "lucide-react";
import { Country } from "@/types";
import { CountryImage } from "@/components/features/game/CountryImage";
import { CountryModal } from "@/components/features/shared/CountryModal";
import { useGameLogic } from "@/lib/hooks/useGameLogic";

type Props = {
  gameLogic: ReturnType<typeof useGameLogic>;
};

export function GamePanel({ gameLogic }: Props) {
  const {
    currentCountry,
    startCountry,
    goalCountry,
    error,
    getCountryName,
    submitAnswer,
    giveUp,
    countries,
    toggleMapVisibility,
  } = gameLogic;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentCountry) {
    return (
      <div className="flex h-full flex-col items-center justify-center overflow-y-auto bg-black/20 p-4 text-white backdrop-blur-sm">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col overflow-y-auto bg-black/20 p-4 backdrop-blur-sm">
        <div className="w-full flex-shrink-0">
          <CountryImage countryId={currentCountry} />
        </div>

        <div className="flex flex-1 flex-col justify-between pt-4">
          <div className="flex-1">
            <motion.div
              key={currentCountry}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-center"
            >
              <p className="text-lg text-neutral-300">現在の国</p>
              <p className="text-4xl font-bold text-white">
                {getCountryName(currentCountry)}
              </p>
            </motion.div>

            <div className="mb-4 rounded-lg border border-yellow-800/50 bg-yellow-50/10 p-4">
              <h2 className="mb-2 text-center text-sm font-bold text-yellow-300">
                旅のルート
              </h2>
              <div className="flex items-center justify-center space-x-2 text-white">
                <p className="font-semibold">{getCountryName(startCountry)}</p>
                <ArrowRight className="h-5 w-5 text-yellow-400" />
                <p className="font-semibold">{getCountryName(goalCountry)}</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="mb-4">
              {error && <p className="text-center text-rose-400">{error}</p>}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition-transform hover:scale-105"
              >
                国を回答する
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => gameLogic.toggleMapVisibility()}
                className="flex items-center justify-center gap-2 rounded-lg bg-white/10 p-2 text-sm text-white transition-colors hover:bg-white/20"
              >
                <Map size={16} />
                地図
              </button>
              <button
                onClick={giveUp}
                className="flex items-center justify-center gap-2 rounded-lg bg-white/10 p-2 text-sm text-white transition-colors hover:bg-rose-500/50"
              >
                <Skull size={16} />
                ギブアップ
              </button>
            </div>
          </div>
        </div>
      </div>
      <CountryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(country) => {
          submitAnswer(country.id);
          setIsModalOpen(false);
        }}
        availableCountries={countries}
        title="次の国を選択"
      />
    </>
  );
}
