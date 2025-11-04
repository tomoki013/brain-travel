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

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <div className="relative w-full h-full overflow-hidden rounded-lg shadow-2xl">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <CountryImage
              countryId={currentCountryId}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-6 text-white">
          <h2 className="text-3xl font-bold drop-shadow-lg">
            {currentCountryName}
          </h2>
          <p className="text-sm font-semibold tracking-widest text-white/80">
            {index + 1} / {routeHistory.length}
          </p>
        </div>
      </div>
    </div>
  );
};
