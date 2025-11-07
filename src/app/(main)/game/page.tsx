"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WorldMap } from "@/components/features/game/WorldMap";
import { GamePanel } from "@/components/features/game/GamePanel";
import { useGameLogic } from "@/lib/hooks/useGameLogic";
import { CountryImage } from "@/components/features/game/CountryImage";

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameLogic = useGameLogic();
  //
  //
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );

  const startCountry = searchParams.get("start");
  const goalCountry = searchParams.get("goal");

  useEffect(() => {
    if (startCountry && goalCountry) {
      gameLogic.initializeGame(startCountry, goalCountry);
    } else {
      router.push("/");
    }
  }, [startCountry, goalCountry, router, gameLogic]);

  useEffect(() => {
    if (gameLogic.currentCountry) {
      setSelectedCountryId(gameLogic.currentCountry);
    }
  }, [gameLogic.currentCountry]);

  if (
    !gameLogic.startCountry ||
    !gameLogic.goalCountry ||
    !gameLogic.currentCountry
  ) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <CountryImage
          countryId={gameLogic.startCountry}
          className="h-full w-full object-cover blur-md scale-110"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Game Layout */}
      <div className="relative z-10 grid h-full lg:grid-cols-3 gap-4 p-4">
        {/* Map Area */}
        <div className="lg:col-span-2 relative h-full">
          {isMapVisible ? (
            <WorldMap
              startCountryId={gameLogic.startCountry}
              goalCountryId={gameLogic.goalCountry}
              currentCountryId={gameLogic.currentCountry}
              routeHistoryIds={gameLogic.routeHistory}
              selectedCountryId={selectedCountryId}
            />
          ) : (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-900/50 backdrop-blur-md">
              <button
                onClick={() => setIsMapVisible(true)}
                className="rounded-full bg-cyan-500/80 px-6 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                地図を表示する
              </button>
            </div>
          )}
        </div>

        {/* Panel Area */}
        <div className="lg:col-span-1 h-full">
          <GamePanel
            currentCountry={gameLogic.currentCountry}
            startCountry={gameLogic.startCountry}
            goalCountry={gameLogic.goalCountry}
            routeHistory={gameLogic.routeHistory}
            gameStatus={gameLogic.gameStatus}
            submitAnswer={gameLogic.submitAnswer}
            error={gameLogic.error}
            setError={gameLogic.setError}
            getNeighborCountries={gameLogic.getNeighborCountries}
            giveUp={gameLogic.giveUp}
            isMapVisible={isMapVisible}
            setIsMapVisible={setIsMapVisible}
            setSelectedCountryId={setSelectedCountryId}
          />
        </div>
      </div>
    </div>
  );
}

// Wrap the component with Suspense as useSearchParams requires it
export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh w-full items-center justify-center bg-gray-900 text-white">
          <p>Loading Game...</p>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
