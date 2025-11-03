"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import borders from "../data/borders.json";

type GameStatus = "playing" | "cleared" | "failed";

// Type assertion for borders.json
const countryBorders = borders as Record<string, string[]>;

export const useGameLogic = () => {
  const router = useRouter();
  const [startCountry, setStartCountry] = useState<string | null>(null);
  const [goalCountry, setGoalCountry] = useState<string | null>(null);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

  /**
   * Initializes the game with a start and goal country.
   * @param start - The ISO 3166-1 alpha-3 code of the starting country.
   * @param goal - The ISO 3166-1 alpha-3 code of the goal country.
   */
  const initializeGame = (start: string, goal: string) => {
    setStartCountry(start);
    setGoalCountry(goal);
    setCurrentCountry(start);
    setRouteHistory([start]);
    setGameStatus("playing");
  };

  /**
   * Submits an answer and updates the game state.
   * @param answerCountry - The ISO 3166-1 alpha-3 code of the answered country.
   */
  const submitAnswer = (answerCountry: string) => {
    if (gameStatus !== "playing" || !currentCountry) {
      return;
    }

    // Check if the answered country is a valid country code
    if (!countryBorders[answerCountry]) {
      alert("存在しない国名です。");
      console.error(`Invalid country code: ${answerCountry}`);
      return;
    }

    // Check if the answered country borders the current country
    if (countryBorders[currentCountry]?.includes(answerCountry)) {
      // Correct answer
      const newRouteHistory = [...routeHistory, answerCountry];
      setRouteHistory(newRouteHistory);
      setCurrentCountry(answerCountry);

      // Check for goal
      if (answerCountry === goalCountry) {
        setGameStatus("cleared");
        router.push(`/result?route=${newRouteHistory.join(',')}`);
      }
    } else {
      // Incorrect answer
      alert("不正解です。その国へは陸路で移動できません。");
      console.error(
        `${answerCountry} does not border ${currentCountry}. Borders: ${countryBorders[currentCountry]}`
      );
    }
  };

  return {
    startCountry,
    goalCountry,
    currentCountry,
    routeHistory,
    gameStatus,
    initializeGame,
    submitAnswer,
  };
};
