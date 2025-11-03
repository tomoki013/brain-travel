'use client';

import { useEffect } from 'react';
import { WorldMap } from '@/components/features/game/WorldMap';
import { GamePanel } from '@/components/features/game/GamePanel';
import { useGameLogic } from '@/lib/hooks/useGameLogic';

// ゲームページ
export default function GamePage() {
  const gameLogic = useGameLogic();

  // マウント時にゲームを初期化
  useEffect(() => {
    gameLogic.initializeGame('JPN', 'FRA');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gameLogic.startCountry || !gameLogic.goalCountry || !gameLogic.currentCountry) {
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
        <GamePanel gameLogic={gameLogic} />
      </div>
    </div>
  );
}
