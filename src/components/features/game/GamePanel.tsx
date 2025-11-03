'use client';

import { CountryImage } from './CountryImage';
import { AnswerForm } from './AnswerForm';
import type { useGameLogic } from '@/lib/hooks/useGameLogic';
import { useCountryData } from '@/lib/hooks/useCountryData';

// useGameLogicの返り値の型を取得
type GameLogic = ReturnType<typeof useGameLogic>;

type GamePanelProps = {
  gameLogic: GameLogic;
};

export const GamePanel = ({ gameLogic }: GamePanelProps) => {
  const {
    currentCountry,
    startCountry,
    goalCountry,
    routeHistory,
    gameStatus,
    submitAnswer,
    giveUp,
  } = gameLogic;
  const { getCountryName } = useCountryData();

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg bg-gray-50 p-6 shadow-lg">
      {currentCountry && <CountryImage countryId={currentCountry} />}

      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">お題</h2>
            <p className="text-gray-600">
              <span className="font-bold">{getCountryName(startCountry)}</span> から{' '}
              <span className="font-bold">{getCountryName(goalCountry)}</span> を目指せ！
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">現在の国</h2>
            <p className="text-2xl font-bold text-blue-600">{getCountryName(currentCountry)}</p>
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
        <AnswerForm onSubmit={submitAnswer} disabled={gameStatus !== 'playing'} />
        <button
          onClick={giveUp}
          disabled={gameStatus !== 'playing'}
          className="w-full rounded-md border border-red-500 px-4 py-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          ギブアップする
        </button>
      </div>
    </div>
  );
};
