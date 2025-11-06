"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, FileText, Lock, Mail, Shuffle, Home } from "lucide-react";
import borders from "@/lib/data/borders.json";

const SitemapPage = () => {
  const router = useRouter();
  const countryCodes = Object.keys(borders);

  const handleRandomStart = () => {
    let startCountry = "";
    let goalCountry = "";

    while (startCountry === goalCountry) {
      const randomIndex1 = Math.floor(Math.random() * countryCodes.length);
      const randomIndex2 = Math.floor(Math.random() * countryCodes.length);
      startCountry = countryCodes[randomIndex1];
      goalCountry = countryCodes[randomIndex2];
    }

    router.push(`/game?start=${startCountry}&goal=${goalCountry}`);
  };

  const pages = [
    {
      name: "トップページ",
      href: "/",
      icon: <Home className="h-8 w-8 text-sky-500" />,
      description: "旅の始まり。ここから新しい冒険が始まります。",
    },
    {
      name: "ゲームページ",
      href: "#", // Not a direct link
      icon: <Map className="h-8 w-8 text-green-500" />,
      description:
        "実際にGeo Linkerをプレイするメインページ。国を選択してゴールを目指します。",
    },
    {
      name: "利用規約",
      href: "/terms",
      icon: <FileText className="h-8 w-8 text-gray-500" />,
      description: "サービスの利用に関するルールを記載しています。",
    },
    {
      name: "プライバシーポリシー",
      href: "/privacy",
      icon: <Lock className="h-8 w-8 text-gray-500" />,
      description: "個人情報の取り扱いについて記載しています。",
    },
    {
      name: "お問い合わせ",
      href: "/contact",
      icon: <Mail className="h-8 w-8 text-gray-500" />,
      description: "開発チームへのご連絡はこちらから。",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            サイトマップ
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Geo Linkerの全ページをご案内します。
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div
              key={page.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                {page.icon}
                <h2 className="text-xl font-bold text-gray-900">
                  {page.href === "#" ? (
                    page.name
                  ) : (
                    <Link href={page.href} className="hover:text-sky-600">
                      {page.name}
                    </Link>
                  )}
                </h2>
              </div>
              <p className="mt-4 text-gray-600">{page.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            新しい旅を始めますか？
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            下のボタンから、ランダムな国で新しいゲームを開始できます。
          </p>
          <button
            onClick={handleRandomStart}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            <Shuffle className="h-6 w-6" />
            ランダムで旅を始める
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
