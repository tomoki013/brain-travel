"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WorldMap } from "@/components/features/game/WorldMap";
import { GamePanel } from "@/components/features/game/GamePanel";
import { useGameLogic } from "@/lib/hooks/useGameLogic";

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameLogic = useGameLogic();

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
    <div className="grid h-dvh grid-cols-3 gap-4 p-4">
      {/* Left Column: Map */}
      <div className="col-span-2">
        <WorldMap
          startCountryId={gameLogic.startCountry}
          goalCountryId={gameLogic.goalCountry}
          currentCountryId={gameLogic.currentCountry}
          routeHistoryIds={gameLogic.routeHistory}
        />
      </div>

      {/* Right Column: Information Panel */}
      <div className="col-span-1">
        <GamePanel
          currentCountry={gameLogic.currentCountry}
          startCountry={gameLogic.startCountry}
          goalCountry={gameLogic.goalCountry}
          routeHistory={gameLogic.routeHistory}
          gameStatus={gameLogic.gameStatus}
          submitAnswer={gameLogic.submitAnswer}
          giveUp={gameLogic.giveUp}
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
