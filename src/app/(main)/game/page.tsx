"use client";

import { WorldMap } from "@/components/features/game/WorldMap";

// ゲームページ
export default function GamePage() {
  // ダミーデータ
  const startCountry = { id: "JPN", name: "日本" };
  const goalCountry = { id: "FRA", name: "フランス" };

  return (
    <div className="flex h-screen">
      {/* 左カラム：地図 */}
      <div className="w-2/3 h-full">
        <WorldMap startCountry={startCountry.id} goalCountry={goalCountry.id} />
      </div>

      {/* 右カラム：情報パネル */}
      <div className="w-1/3 h-full bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">脳内世界旅行</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">スタート国</h2>
            <p className="text-xl">{startCountry.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">ゴール国</h2>
            <p className="text-xl">{goalCountry.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
