"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WorldMap } from "@/components/features/game/WorldMap";
import { GamePanel } from "@/components/features/game/GamePanel";
import { useGameLogic } from "@/lib/hooks/useGameLogic";

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameLogic = useGameLogic();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null
  );

  const startCountry = searchParams.get("start");
  const goalCountry = searchParams.get("goal");

  useEffect(() => {
    if (startCountry && goalCountry) {
      gameLogic.initializeGame(startCountry, goalCountry);
    } else {
      // If query parameters are missing, redirect to the top page.
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCountry, goalCountry]);

  if (
    !gameLogic.startCountry ||
    !gameLogic.goalCountry ||
    !gameLogic.currentCountry
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid h-dvh lg:grid-cols-3 gap-4 p-4">
      {/* Left Column: Map */}
      <div className="lg:col-span-2 relative h-full">
        <WorldMap
          startCountryId={gameLogic.startCountry}
          goalCountryId={gameLogic.goalCountry}
          currentCountryId={gameLogic.currentCountry}
          routeHistoryIds={gameLogic.routeHistory}
          selectedCountryId={selectedCountryId}
        />
        {isMapVisible ? (
          <button
            onClick={() => setIsMapVisible(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            地図を隠す
          </button>
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

      {/* Right Column: Information Panel */}
      <div className="lg:col-span-1">
        <GamePanel
          currentCountry={gameLogic.currentCountry}
          startCountry={gameLogic.startCountry}
          goalCountry={gameLogic.goalCountry}
          routeHistory={gameLogic.routeHistory}
          gameStatus={gameLogic.gameStatus}
          submitAnswer={gameLogic.submitAnswer}
          giveUp={gameLogic.giveUp}
          isMapVisible={isMapVisible}
          setIsMapVisible={setIsMapVisible}
          setSelectedCountryId={setSelectedCountryId}
        />
      </div>
    </div>
  );
}

// Wrap the component with Suspense as useSearchParams requires it
export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
