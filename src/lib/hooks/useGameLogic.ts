"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { GameStatus, Country } from "@/types";
import borders from "../data/borders.json";
import { countries } from "../data/countries";

// Type assertion for borders.json
const countryBorders = borders as Record<string, string[]>;

export const useGameLogic = () => {
  const router = useRouter();
  const [startCountry, setStartCountry] = useState<string | null>(null);
  const [goalCountry, setGoalCountry] = useState<string | null>(null);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useCallback((start: string, goal: string) => {
    setStartCountry(start);
    setGoalCountry(goal);
    setCurrentCountry(start);
    setRouteHistory([start]);
    setGameStatus("playing");
  }, []);

  /**
   * Submits an answer and updates the game state.
   * @param answerCountry - The ISO 3166-1 alpha-3 code of the answered country.
   */
  const submitAnswer = useCallback(
    (answerCountry: string) => {
      setError(null);
      if (gameStatus !== "playing" || !currentCountry) {
        return;
      }

      if (!countryBorders[answerCountry]) {
        setError("存在しない国名です。");
        return;
      }

      if (countryBorders[currentCountry]?.includes(answerCountry)) {
        const newRouteHistory = [...routeHistory, answerCountry];
        setRouteHistory(newRouteHistory);
        setCurrentCountry(answerCountry);

        if (answerCountry === goalCountry) {
          setGameStatus("cleared");
          router.push(`/result?route=${newRouteHistory.join(",")}`);
        }
      } else {
        setError("不正解です。その国へは陸路で移動できません。");
      }
    },
    [gameStatus, currentCountry, routeHistory, goalCountry, router]
  );

  const getNeighborCountries = useCallback((): Country[] => {
    if (!currentCountry) return [];
    const neighborCodes = countryBorders[currentCountry] || [];
    return countries.filter((c) => neighborCodes.includes(c.id));
  }, [currentCountry]);

  /**
   * Gives up the game and navigates to the result page.
   */
  const giveUp = () => {
    setGameStatus("given_up");
    router.push(`/result?route=${routeHistory.join(",")}&status=given_up`);
  };

  // A dummy function to satisfy the prop, can be expanded later
  const setSelectedCountryId = (countryId: string | null) => {
    // This could be used for map highlighting in the future
  };

  return {
    startCountry,
    goalCountry,
    currentCountry,
    routeHistory,
    gameStatus,
    error,
    setError,
    initializeGame,
    submitAnswer,
    giveUp,
    getNeighborCountries,
    setSelectedCountryId,
  };
};
