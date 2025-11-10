"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CountryImage } from "@/components/features/game/CountryImage";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { Button } from "@/components/ui/Button";

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
      (prevIndex) =>
        (prevIndex - 1 + routeHistory.length) % routeHistory.length,
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
        <Button
          onClick={goToPrev}
          variant="glass"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={goToNext}
          variant="glass"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

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
