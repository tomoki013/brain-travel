import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 国IDを国名に変換する関数（これは別途定義が必要です）
const getCountryName = (countryId: string): string => {
  const names: { [key: string]: string } = {
    JPN: "Japan",
    FRA: "France",
    USA: "USA",
    ESP: "Spain",
    // ... 他の国
  };
  return names[countryId] || countryId;
};

// GETリクエストを処理する関数をexportします
export async function GET(req: Request) {
  // 1. クライアントから国IDを受け取る
  // (例: /api/getImageUrl?countryId=JPN)
  const { searchParams } = new URL(req.url); // req.urlからURLオブジェクトを作成
  const countryId = searchParams.get("countryId"); // 'countryId'パラメータを取得

  if (typeof countryId !== "string" || !countryId) {
    return NextResponse.json(
      { error: "countryId is required" },
      { status: 400 }, // エラーレスポンス
    );
  }

  // 2. ローカルファイルの存在を「実際に」チェックする
  const localImagePath = path.join(
    process.cwd(),
    "public",
    "images",
    "countries",
    `${countryId}.jpg`,
  );

  if (fs.existsSync(localImagePath)) {
    // ファイルが存在すれば、そのパスを返す
    return NextResponse.json({
      imageUrl: `/images/countries/${countryId}.jpg`,
    });
  }

  // 3. Unsplash APIキーを「サーバーサイドのみ」で取得
  const apiKey = process.env.UNSPLASH_ACCESS_KEY; // NEXT_PUBLIC_ が無いキー

  if (apiKey) {
    try {
      const countryName = getCountryName(countryId);
      const query = `${countryName} landmark landscape`;
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query,
        )}&orientation=landscape&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        },
      );

      if (!response.ok) throw new Error("Unsplash API request failed");

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // 成功したらUnsplashのURLを返す
        return NextResponse.json({ imageUrl: data.results[0].urls.regular });
      }
    } catch (error) {
      console.error("Failed to fetch image from Unsplash:", error);
      // エラーが発生しても、フォールバックに進む
    }
  }

  // 4. すべて失敗した場合、デフォルト画像を返す
  return NextResponse.json({ imageUrl: "/default-globe.jpg" });
}
