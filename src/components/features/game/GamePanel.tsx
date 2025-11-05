"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CountryImage } from "./CountryImage";
import { CountrySelector } from "@/components/features/shared/CountrySelector";
import { useState } from "react";
import type { GameStatus } from "@/types";
import { useCountryData } from "@/lib/hooks/useCountryData";

type GamePanelProps = {
  currentCountry: string | null;
  startCountry: string | null;
  goalCountry: string | null;
  routeHistory: string[];
  gameStatus: GameStatus;
  error: string | null;
  setError: (error: string | null) => void;
  submitAnswer: (answer: string) => void;
  giveUp: () => void;
  isMapVisible: boolean;
  setIsMapVisible: (value: boolean) => void;
  setSelectedCountryId: (countryId: string | null) => void;
  getNeighborCountries: () => any[];
};

export const GamePanel = ({
  currentCountry,
  startCountry,
  goalCountry,
  routeHistory,
  gameStatus,
  error,
  setError,
  submitAnswer,
  giveUp,
  isMapVisible,
  setIsMapVisible,
  setSelectedCountryId,
  getNeighborCountries,
}: GamePanelProps) => {
  const { getCountryName } = useCountryData();

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg bg-black/20 p-4 shadow-2xl backdrop-blur-md text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCountry}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-video w-full"
        >
          {currentCountry && (
            <CountryImage
              countryId={currentCountry}
              className="rounded-lg object-cover shadow-xl"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-y-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest text-white/60">
              お題
            </h2>
            <p className="mt-1 text-lg">
              <span className="font-bold">{getCountryName(startCountry)}</span>{" "}
              から{" "}
              <span className="font-bold">{getCountryName(goalCountry)}</span>{" "}
              を目指せ！
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest text-white/60">
              現在の国
            </h2>
            <p className="mt-1 text-4xl font-bold text-white drop-shadow-lg">
              {getCountryName(currentCountry)}
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest text-white/60 mb-2">
              移動履歴
            </h2>
            <div className="max-h-40 overflow-y-auto rounded-md bg-black/20 p-3 text-sm">
              <ul className="space-y-2">
                {routeHistory.map((countryId, index) => (
                  <li
                    key={`${countryId}-${index}`}
                    className="flex items-baseline"
                  >
                    <span className="mr-3 font-mono text-white/60">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <span className="font-semibold">
                      {getCountryName(countryId)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 space-y-3">
          {error && (
            <div className="rounded-md bg-red-500/30 p-2 text-center text-sm font-semibold text-red-100">
              {error}
            </div>
          )}
          <CountrySelector
            id="game-country-selector"
            value={null}
            onChange={(a3Code) => submitAnswer(a3Code)}
            onSuggestionSelect={setSelectedCountryId}
            availableCountries={getNeighborCountries()}
            onError={setError}
            disabled={gameStatus !== "playing"}
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsMapVisible(!isMapVisible)}
              className="w-full rounded-md bg-white/20 px-4 py-2 text-white transition-colors hover:bg-white/30"
            >
              {isMapVisible ? "地図を隠す" : "地図を表示"}
            </button>
            <button
              onClick={giveUp}
              disabled={gameStatus !== "playing"}
              className="w-full rounded-md bg-red-900/50 px-4 py-2 text-red-200 transition-colors hover:bg-red-900/70 disabled:cursor-not-allowed disabled:bg-gray-600/50 disabled:text-gray-400"
            >
              ギブアップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
