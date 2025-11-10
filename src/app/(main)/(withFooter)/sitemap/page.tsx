"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, FileText, Lock, Mail, Shuffle, Home } from "lucide-react";
import borders from "@/lib/data/borders.json";
import { Button } from "@/components/ui/Button";

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
      name: "ホーム",
      href: "/",
      icon: <Home className="h-8 w-8 text-sky-400" />,
      description: "旅の始まり。ここから新しい冒険が始まります。",
    },
    {
      name: "ゲームページ",
      href: "/game",
      icon: <Map className="h-8 w-8 text-green-400" />,
      description:
        "実際にGeo Linkerをプレイするメインページ。国を選択してゴールを目指します。",
    },
    {
      name: "利用規約",
      href: "/terms",
      icon: <FileText className="h-8 w-8 text-neutral-500" />,
      description: "サービスの利用に関するルールを記載しています。",
    },
    {
      name: "プライバシーポリシー",
      href: "/privacy",
      icon: <Lock className="h-8 w-8 text-neutral-500" />,
      description: "個人情報の取り扱いについて記載しています。",
    },
    {
      name: "お問い合わせ",
      href: "/contact",
      icon: <Mail className="h-8 w-8 text-neutral-500" />,
      description: "開発チームへのご連絡はこちらから。",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            サイトマップ
          </h1>
          <p className="mt-4 text-xl text-neutral-400">
            Geo Linkerの全ページをご案内します。
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              href={page.href}
              key={page.name}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-lg transition-all duration-300 hover:border-neutral-700 hover:shadow-sky-900/20"
            >
              <div className="flex items-center gap-4">
                {page.icon}
                <h2 className="text-xl font-bold text-neutral-50">
                  {page.href === "#" ? (
                    page.name
                  ) : (
                    <p className="transition-colors group-hover:text-sky-400">
                      {page.name}
                    </p>
                  )}
                </h2>
              </div>
              <p className="mt-4 text-neutral-400">{page.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            新しい旅を始めますか？
          </h2>
          <p className="mt-3 text-lg text-neutral-400">
            下のボタンから、ランダムな国で新しいゲームを開始できます。
          </p>
          <Button
            onClick={handleRandomStart}
            variant="primary"
            size="lg"
            className="mt-8"
          >
            <Shuffle className="mr-3 h-6 w-6" />
            ランダムで旅を始める
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
