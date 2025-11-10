"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { ResultSlideshow } from "@/components/features/result/ResultSlideshow";
import { CountryImage } from "@/components/features/game/CountryImage";
import borderData from "@/lib/data/borders.json";
import { Button } from "@/components/ui/Button";
import { Share2, Copy, Check } from "lucide-react";
import { FaFacebook, FaLine } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

export const ResultPageClient = () => {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("route");
  const status = searchParams.get("status");
  const routeHistory = routeQuery ? routeQuery.split(",") : [];

  const { getCountryName } = useCountryData();
  const countryNames = routeHistory.map(getCountryName).join(" → ");

  const isGivenUp = status === "given_up";

  const startCountry = routeHistory.length > 0 ? routeHistory[0] : "";
  const goalCountry =
    routeHistory.length > 0 ? routeHistory[routeHistory.length - 1] : "";

  const countryIds = Object.keys(borderData);
  const bgCountryId = isGivenUp ? startCountry : goalCountry || startCountry;

  const handleRetrySame = () => {
    // startCountry and goalCountry are derived from the routeHistory query param
    if (startCountry && goalCountry) {
      router.push(`/game?start=${startCountry}&goal=${goalCountry}`);
    }
  };

  const handleRetryDifferent = () => {
    router.push("/");
  };

  const handleRetryRandom = () => {
    let randomStart, randomGoal;
    do {
      randomStart = countryIds[Math.floor(Math.random() * countryIds.length)];
      randomGoal = countryIds[Math.floor(Math.random() * countryIds.length)];
    } while (randomStart === randomGoal);
    router.push(`/game?start=${randomStart}&goal=${randomGoal}`);
  };

  const handleGoTop = () => {
    router.push("/");
  };

  const handleShare = (
    platform: "x" | "line" | "facebook" | "copy" | "webshare"
  ) => {
    const shareUrl = window.location.href;
    const shareText = isGivenUp
      ? `Geo Linkerで旅の途中でギブアップしました！\nルート: ${countryNames}\n#GeoLinker`
      : `Geo Linkerで世界旅行を達成しました！\nルート: ${countryNames}\n#GeoLinker`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case "x":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          "_blank"
        );
        break;
      case "line":
        window.open(
          `https://line.me/R/msg/text/?${encodedText}%0A${encodedUrl}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
        break;
      case "webshare":
        if (navigator.share) {
          navigator.share({
            title: "Geo Linker Result",
            text: shareText,
            url: shareUrl,
          });
        } else {
          alert("お使いのブラウザはWeb共有APIをサポートしていません。");
        }
        break;
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8 overflow-hidden text-white">
      {/* Background Image */}
      {bgCountryId && (
        <CountryImage
          countryId={bgCountryId}
          className="absolute inset-0 z-0"
        />
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`text-5xl sm:text-7xl font-extrabold mb-4 drop-shadow-lg ${
            isGivenUp
              ? "text-gray-300"
              : "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500"
          }`}
        >
          {isGivenUp ? "GIVE UP" : "CLEAR!"}
        </motion.h1>
        <p className="text-lg text-gray-200 mb-8">
          {isGivenUp
            ? "今回の旅はここまでです。"
            : "あなたは見事、世界旅行を達成しました！"}
        </p>

        <div className="mb-12 rounded-lg bg-white/10 p-4 sm:p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100">
            旅のルート
          </h2>
          <p className="text-base sm:text-xl font-mono text-yellow-200 p-2 sm:p-4 rounded-lg">
            {countryNames}
          </p>
        </div>

        <div className="w-full aspect-video max-w-2xl mx-auto mb-12">
          <ResultSlideshow routeHistory={routeHistory} />
        </div>

        {/* Share Buttons */}
        <div className="mt-12 border-t border-gray-600 pt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100">
            旅の結果をシェアする
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button
              variant="social-x"
              size="icon"
              onClick={() => handleShare("x")}
            >
              <FaX />
            </Button>
            <Button
              variant="social-line"
              size="icon"
              onClick={() => handleShare("line")}
            >
              <FaLine />
            </Button>
            <Button
              variant="social-facebook"
              size="icon"
              onClick={() => handleShare("facebook")}
            >
              <FaFacebook />
            </Button>
            <Button
              variant={isCopied ? "social-x" : "social-copy"}
              size="icon"
              onClick={() => handleShare("copy")}
              disabled={isCopied}
            >
              {isCopied ? <Check /> : <Copy />}
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={() => handleShare("webshare")}
            >
              <Share2 />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 border-t border-gray-600 pt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-100">
            次の旅に出かけよう
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button
              onClick={handleRetrySame}
              disabled={isGivenUp || !startCountry || !goalCountry}
              variant="primary"
              size="lg"
            >
              もう一度
            </Button>
            <Button
              onClick={handleRetryDifferent}
              variant="secondary"
              size="lg"
            >
              設定変更
            </Button>
            <Button onClick={handleRetryRandom} variant="secondary" size="lg">
              ランダム
            </Button>
            <Button onClick={handleGoTop} variant="glass" size="lg">
              トップへ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
