'use client';

import Image from 'next/image';
import { useCountryData } from '@/lib/hooks/useCountryData';

type CountryImageProps = {
  countryId: string;
};

/**
 * 国の画像を表示するコンポーネント
 * @param countryId 国ID (ISO 3166-1 alpha-3)
 */
export const CountryImage = ({ countryId }: CountryImageProps) => {
  const { getImageUrl, getCountryName } = useCountryData();
  const imageUrl = getImageUrl(countryId);
  const countryName = getCountryName(countryId);

  return (
    <div className="relative h-60 w-full overflow-hidden rounded-lg shadow-md">
      <Image
        src={imageUrl}
        alt={`Image of ${countryName}`}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
};
