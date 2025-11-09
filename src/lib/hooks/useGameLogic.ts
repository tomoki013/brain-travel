"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { GameStatus, Country } from "@/types";
import borders from "../data/borders.json";
import { useCountryData } from "./useCountryData";

// Type assertion for borders.json
const countryBorders = borders as Record<string, string[]>;

export const useGameLogic = () => {
  const router = useRouter();
  const { countries } = useCountryData();

  const [startCountry, setStartCountry] = useState<string | null>(null);
  const [goalCountry, setGoalCountry] = useState<string | null>(null);
  const [currentCountry, setCurrentCountry] = useState<string | null>(null);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [error, setError] = useState<string | null>(null);

  const countryMap = useMemo(() => {
    return new Map(countries.map((c) => [c.id, c]));
  }, [countries]);

  const getCountryById = useCallback(
    (id: string): Country | undefined => {
      return countryMap.get(id);
    },
    [countryMap]
  );

  const initializeGame = useCallback((start: string, goal: string) => {
    setStartCountry(start);
    setGoalCountry(goal);
    setCurrentCountry(start);
    setRouteHistory([start]);
    setGameStatus("playing");
  }, []);

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
    return neighborCodes
      .map((code) => getCountryById(code))
      .filter((c): c is Country => c !== undefined);
  }, [currentCountry, getCountryById]);

  const giveUp = () => {
    setGameStatus("given_up");
    router.push(`/result?route=${routeHistory.join(",")}&status=given_up`);
  };

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
