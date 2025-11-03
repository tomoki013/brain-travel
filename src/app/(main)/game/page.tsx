"use client";

import { useEffect } from "react";
import { WorldMap } from "@/components/features/game/WorldMap";
import { AnswerForm } from "@/components/features/game/AnswerForm";
import { useGameLogic } from "@/lib/hooks/useGameLogic";

// ゲームページ
export default function GamePage() {
  const {
    startCountry,
    goalCountry,
    currentCountry,
    routeHistory,
    gameStatus,
    initializeGame,
    submitAnswer,
  } = useGameLogic();

  // マウント時にゲームを初期化
  useEffect(() => {
    initializeGame("JPN", "FRA");
  }, []);

  if (!startCountry || !goalCountry || !currentCountry) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* 左カラム：地図 */}
      <div className="w-2/3 h-full">
        <WorldMap
          startCountry={startCountry}
          goalCountry={goalCountry}
          currentCountry={currentCountry}
          routeHistory={routeHistory}
        />
      </div>

      {/* 右カラム：情報パネル */}
      <div className="w-1/3 h-full bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">脳内世界旅行</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">スタート国</h2>
            <p className="text-xl">{startCountry}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">ゴール国</h2>
            <p className="text-xl">{goalCountry}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">現在の国</h2>
            <p className="text-xl">{currentCountry}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">ルート履歴</h2>
            <p className="text-sm">{routeHistory.join(" → ")}</p>
          </div>

          {gameStatus === "playing" && (
            <div>
              <h2 className="text-lg font-semibold mt-6 mb-2">
                次の国を入力してください
              </h2>
              <AnswerForm onSubmit={submitAnswer} />
            </div>
          )}

          {gameStatus === "cleared" && (
            <div className="mt-6 p-4 bg-green-100 rounded-md">
              <p className="font-bold text-green-700">
                🎉 ゴール！おめでとうございます！ 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
