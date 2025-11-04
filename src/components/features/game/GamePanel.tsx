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
    <div className="flex h-full flex-col gap-4 rounded-lg bg-white/30 p-6 shadow-lg backdrop-blur-lg text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCountry}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-60 shrink-0 relative"
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
        <div className="flex-1 space-y-6 pr-2 overflow-y-auto">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
              現在の国
            </h2>
            <p className="mt-1 text-4xl font-bold text-white drop-shadow-lg">
              {getCountryName(currentCountry)}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">
              移動履歴
            </h2>
            <div className="max-h-48 overflow-y-auto rounded-md bg-black/20 p-3 text-sm">
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

        {/* Sticky Footer for Form */}
        <div className="mt-auto pt-4 space-y-4">
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-500/50 bg-red-500/30 px-4 py-3 text-base font-semibold text-white shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
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
