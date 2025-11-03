"use client";

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
    <div className="flex h-full flex-col gap-4 rounded-lg bg-gray-50 p-6 shadow-lg">
      {currentCountry && <CountryImage countryId={currentCountry} />}

      <div className="overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">お題</h2>
            <p className="text-gray-600">
              <span className="font-bold">{getCountryName(startCountry)}</span>{" "}
              から{" "}
              <span className="font-bold">{getCountryName(goalCountry)}</span>{" "}
              を目指せ！
            </p>
            <button
                onClick={() => setIsMapVisible(!isMapVisible)}
                className="mt-2 text-sm text-blue-600 hover:underline"
            >
                {isMapVisible ? "地図を隠す" : "地図を表示する"}
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">現在の国</h2>
            <p className="text-2xl font-bold text-blue-600">
              {getCountryName(currentCountry)}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">移動履歴</h2>
            <ul className="list-disc space-y-1 pl-5">
              {routeHistory.map((countryId, index) => (
                <li key={`${countryId}-${index}`} className="text-gray-600">
                  {getCountryName(countryId)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {error && (
          <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">
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
          className="w-full rounded-md border border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          ギブアップする
        </button>
      </div>
    </div>
  );
};
