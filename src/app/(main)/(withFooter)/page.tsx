"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CountrySelector } from "@/components/features/shared/CountrySelector";
import { useCountryData } from "@/lib/hooks/useCountryData";
import Image from "next/image";

export default function TopPage() {
  const router = useRouter();
  const { getPlayableCountries, getCountriesInSameContinent, countries } =
    useCountryData();
  const [startCountry, setStartCountry] = useState<string | null>(null);
  const [goalCountry, setGoalCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playableCountries = useMemo(
    () => getPlayableCountries(),
    [getPlayableCountries]
  );
  const goalCountries = useMemo(() => {
    if (!startCountry) return [];
    const sameContinentA3s = getCountriesInSameContinent(startCountry);
    return countries.filter(
      (c) => sameContinentA3s.includes(c.id) && c.id !== startCountry
    );
  }, [startCountry, countries, getCountriesInSameContinent]);

  const handleStartRandom = () => {
    // 既存のロジック（countries から2つ選ぶ）を削除します。
    // getPlayableCountries() を呼び出し、プレイ可能な国のリストを取得します。
    // そのリストからランダムにスタート国を1つ選びます。
    const startCountry =
      playableCountries[Math.floor(Math.random() * playableCountries.length)];

    // getCountriesInSameContinent(スタート国ID) を呼び出し、同じ大陸塊の国リストを取得します。
    const continentPeers = getCountriesInSameContinent(startCountry.id);

    let goalCountryId: string | null = null;
    // そのリストからランダムにゴール国を1つ選びます（スタート国と重複しないように再試行してください）。
    // 大陸に国が1つしかない、というエッジケースを処理します。
    if (continentPeers.length > 1) {
      do {
        const randomPeerId =
          continentPeers[Math.floor(Math.random() * continentPeers.length)];
        if (randomPeerId !== startCountry.id) {
          goalCountryId = randomPeerId;
        }
      } while (goalCountryId === null);
    } else {
      // 「プレイ可能」な国が大陸に1つしかない、という稀なケースのフォールバック。
      // 本来であればエラー表示やスタート国の再選択をすべきですが、
      // このタスクでは、クリア不可能なゲームとして開始させます。
      goalCountryId = startCountry.id;
    }

    // 取得した startCountry.id と goalCountry.id を使って router.push してください。
    router.push(`/game?start=${startCountry.id}&goal=${goalCountryId}`);
  };

  const handleStartSelected = () => {
    if (startCountry && goalCountry && startCountry !== goalCountry) {
      setError(null);
      router.push(`/game?start=${startCountry}&goal=${goalCountry}`);
    } else {
      setError("スタート国とゴール国は異なる国を選択してください。");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Image */}
      <div className={`absolute inset-0 z-0`}>
        <Image
          src={`/images/default-globe.jpg`}
          alt={`壮大な地球の画像`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content Overlay */}
      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          variants={itemVariants}
        >
          Geo Linker
        </motion.h1>
        <motion.p
          className="mt-6 text-lg leading-8 text-gray-200"
          variants={itemVariants}
        >
          スタート国とゴール国を選んで、旅に出かけよう！
        </motion.p>

        {/* Random Start */}
        <motion.div className="mt-10" variants={itemVariants}>
          <button
            onClick={handleStartRandom}
            className="rounded-md bg-indigo-500 px-4 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            ランダムで旅を始める
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div className="my-8 flex items-center" variants={itemVariants}>
          <div className="grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-300">OR</span>
          <div className="grow border-t border-gray-400"></div>
        </motion.div>

        {/* Selected Start */}
        <motion.div
          className="rounded-lg bg-white/10 p-8 shadow-xl backdrop-blur-md"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            自分で国を選んで旅する
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-country"
                className="block text-sm font-medium leading-6 text-gray-200 text-left"
              >
                スタート国
              </label>
              <div className="mt-2">
                <CountrySelector
                  id="start-country"
                  value={startCountry}
                  onChange={(countryId) => {
                    setStartCountry(countryId);
                    setGoalCountry(null); // Reset goal country when start changes
                  }}
                  availableCountries={playableCountries}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="goal-country"
                className="block text-sm font-medium leading-6 text-gray-200 text-left"
              >
                ゴール国
              </label>
              <div className="mt-2">
                <CountrySelector
                  id="goal-country"
                  value={goalCountry}
                  onChange={setGoalCountry}
                  availableCountries={goalCountries}
                  disabled={!startCountry}
                />
              </div>
            </div>
          </div>
          <div className="mt-8">
            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
            <button
              onClick={handleStartSelected}
              className="w-full rounded-md bg-teal-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              この国で旅を始める
            </button>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
