"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryImage } from "@/components/features/game/CountryImage";
import { useCountryData } from "@/lib/hooks/useCountryData";

type ResultSlideshowProps = {
  routeHistory: string[];
};

export const ResultSlideshow = ({ routeHistory }: ResultSlideshowProps) => {
  const [index, setIndex] = useState(0);
  const { getCountryName } = useCountryData();

  const currentCountryId = routeHistory[index];
  const currentCountryName = getCountryName(currentCountryId);

  const goToNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % routeHistory.length);
  };

  const goToPrev = () => {
    setIndex(
      (prevIndex) => (prevIndex - 1 + routeHistory.length) % routeHistory.length
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{currentCountryName}</h2>
      <div className="relative h-96 overflow-hidden rounded-lg shadow-xl">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full"
          >
            <CountryImage countryId={currentCountryId} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={goToPrev}
          className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
        >
          前へ
        </button>
        <button
          onClick={goToNext}
          className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
        >
          次へ
        </button>
      </div>
      <div className="text-center mt-2 text-sm text-slate-500">
        {index + 1} / {routeHistory.length}
      </div>
    </div>
  );
};
