"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Map, Skull, Send } from "lucide-react";
import { CountryImage } from "@/components/features/game/CountryImage";
import { CountryModal } from "@/components/features/shared/CountryModal";
import { useGameLogic } from "@/lib/hooks/useGameLogic";
import { Button } from "@/components/ui/Button";

type Props = {
  gameLogic: ReturnType<typeof useGameLogic>;
  toggleMapVisibility: () => void;
  isMapVisible: boolean;
};

export function GamePanel({
  gameLogic,
  toggleMapVisibility,
  isMapVisible,
}: Props) {
  const {
    currentCountry,
    startCountry,
    goalCountry,
    error,
    getCountryName,
    submitAnswer,
    giveUp,
    countries,
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
        <div className="w-full shrink-0">
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

          <div className="shrink-0 space-y-2">
            {error && <p className="text-center text-rose-400">{error}</p>}
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-5 w-5" />
              国を回答する
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={toggleMapVisibility}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                <Map size={16} className="mr-2" />
                {isMapVisible ? "地図を非表示" : "地図を表示"}
              </Button>
              <Button
                onClick={giveUp}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Skull size={16} className="mr-2" />
                ギブアップ
              </Button>
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
