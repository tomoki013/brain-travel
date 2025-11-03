import countryCodes from '../data/country-codes.json';
import world from '../data/world.json';
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import type { Topology } from 'topojson-specification';

// Type assertion for countryCodes.json
const codes = countryCodes as Record<string, { a3: string; name: string }>;

// Create a mapping from a3 to numeric id
const a3ToNumericId: Record<string, string> = {};
const geoJson = feature(
  world as unknown as Topology,
  world.objects.countries as any
) as unknown as FeatureCollection;
geoJson.features.forEach((feature) => {
  if (feature.id) {
    const numericId = feature.id.toString();
    if (codes[numericId]) {
      a3ToNumericId[codes[numericId].a3] = numericId;
    }
  }
});

/**
 * 国に関連するデータを取得するためのカスタムフック
 */
export const useCountryData = () => {
  /**
   * 国IDに基づいて写真のURLを取得する
   * @param countryId 国ID (ISO 3166-1 alpha-3)
   * @returns 写真のURL
   */
  const getImageUrl = (countryId: string): string => {
    // TODO: ローカルに写真が存在するかどうかを動的にチェックする
    //       （将来的には、`public/images/countries` 内のファイル一覧を
    //         ビルド時に取得して定数化するなどの方法が考えられる）

    // GEMINI.md のルールに基づき、まずはローカル写真を優先する
    if (countryId === 'JPN') {
      return '/images/countries/Japan.jpg';
    }
    if (countryId === 'FRA') {
      return '/images/countries/France.jpg';
    }
    if (countryId === 'USA') {
      return '/images/countries/USA.jpg';
    }

    // TODO: Implement API fetch from Unsplash or another service
    // const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;
    // if (apiKey) {
    //   // APIから写真を取得するロजिक
    // }

    // ローカル写真がない場合はデフォルト画像を返す
    return '/default-globe.jpg';
  };

  /**
   * 国IDに基づいて国名を取得する
   * @param countryId 国ID (ISO 3166-1 alpha-3)
   * @returns 国名
   */
  const getCountryName = (countryId: string | null): string => {
    if (!countryId) {
      return 'N/A';
    }
    const numericId = a3ToNumericId[countryId];
    if (numericId && codes[numericId]) {
      return codes[numericId].name;
    }
    return countryId; // Fallback to id if name not found
  };

  return { getImageUrl, getCountryName };
};
