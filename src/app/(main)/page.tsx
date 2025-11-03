'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { countries } from '@/lib/data/countries';
import borderData from '@/lib/data/borders.json';

export default function TopPage() {
  const router = useRouter();
  const [startCountry, setStartCountry] = useState(countries[0].id);
  const [goalCountry, setGoalCountry] = useState(countries[1].id);

  // Type assertion for borderData
  const countryBorders = borderData as Record<string, string[]>;

  const handleStartRandom = () => {
    const countryIds = Object.keys(countryBorders);
    let randomStart, randomGoal;

    do {
      randomStart = countryIds[Math.floor(Math.random() * countryIds.length)];
      randomGoal = countryIds[Math.floor(Math.random() * countryIds.length)];
    } while (randomStart === randomGoal);

    router.push(`/game?start=${randomStart}&goal=${randomGoal}`);
  };

  const handleStartSelected = () => {
    if (startCountry && goalCountry && startCountry !== goalCountry) {
      router.push(`/game?start=${startCountry}&goal=${goalCountry}`);
    } else {
      alert('スタート国とゴール国は異なる国を選択してください。');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          脳内世界旅行
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          スタート国とゴール国を選んで、脳内旅行に出かけよう！
        </p>

        {/* Random Start */}
        <div className="mt-10">
          <button
            onClick={handleStartRandom}
            className="rounded-md bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            ランダムで旅を始める
          </button>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Selected Start */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            自分で国を選んで旅する
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="start-country" className="block text-sm font-medium leading-6 text-gray-900">
                スタート国
              </label>
              <select
                id="start-country"
                name="start-country"
                value={startCountry}
                onChange={(e) => setStartCountry(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="goal-country" className="block text-sm font-medium leading-6 text-gray-900">
                ゴール国
              </label>
              <select
                id="goal-country"
                name="goal-country"
                value={goalCountry}
                onChange={(e) => setGoalCountry(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleStartSelected}
              className="w-full rounded-md bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              この国で旅を始める
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
