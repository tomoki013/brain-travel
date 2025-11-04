"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CountryImage } from "./CountryImage";
import { AnswerForm } from "./AnswerForm";
import { useState } from "react";
import type { GameStatus } from "@/types";
import { useCountryData } from "@/lib/hooks/useCountryData";

type GamePanelProps = {
  currentCountry: string | null;
  startCountry: string | null;
  goalCountry: string | null;
  routeHistory: string[];
  gameStatus: GameStatus;
  submitAnswer: (answer: string, setError: (message: string) => void) => void;
  giveUp: () => void;
  isMapVisible: boolean;
  setIsMapVisible: (value: boolean) => void;
  setSelectedCountryId: (countryId: string | null) => void;
};

export const GamePanel = ({
  currentCountry,
  startCountry,
  goalCountry,
  routeHistory,
  gameStatus,
  submitAnswer,
  giveUp,
  isMapVisible,
  setIsMapVisible,
  setSelectedCountryId,
}: GamePanelProps) => {
  const { getCountryName } = useCountryData();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (answer: string) => {
    setError(null); // Clear previous errors
    if (answer) {
      submitAnswer(answer, setError);
    } else {
      setError("有効な国名を入力してください");
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg bg-black/20 p-6 shadow-lg backdrop-blur-sm text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCountry}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-60 flex-shrink-0"
        >
          {currentCountry && (
            <CountryImage
              countryId={currentCountry}
              className="rounded-lg shadow-xl"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Info Panel Section */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 pr-2 overflow-y-auto">
          <div>
            <h2 className="text-lg font-semibold text-gray-200">お題</h2>
            <p className="text-gray-100">
              <span className="font-bold">{getCountryName(startCountry)}</span>{" "}
              から{" "}
              <span className="font-bold">{getCountryName(goalCountry)}</span>{" "}
              を目指せ！
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-200">現在の国</h2>
            <p className="text-4xl font-bold text-white">
              {getCountryName(currentCountry)}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-2">
              移動履歴
            </h2>
            <div className="max-h-48 overflow-y-auto rounded-md border border-yellow-800/50 bg-yellow-50/10 p-3">
              <ul className="space-y-2">
                {routeHistory.map((countryId, index) => (
                  <li
                    key={`${countryId}-${index}`}
                    className="font-mono text-sm text-yellow-200"
                  >
                    <span className="font-sans font-bold text-gray-300 mr-2">
                      {index + 1}.
                    </span>
                    {getCountryName(countryId)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Footer for Form */}
        <div className="mt-auto pt-4 space-y-4">
        {error && (
          <div className="rounded-md bg-red-900/50 p-3 text-sm text-red-200 border border-red-700">
            {error}
          </div>
        )}
        <AnswerForm
          onSubmit={handleSubmit}
          disabled={gameStatus !== "playing"}
          onSuggestionSelect={setSelectedCountryId}
        />
        <button
          onClick={giveUp}
          disabled={gameStatus !== "playing"}
          className="w-full rounded-md border border-red-500 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          ギブアップする
        </button>
        </div>
      </div>
    </div>
  );
};
