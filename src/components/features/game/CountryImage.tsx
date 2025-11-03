"use client";

import Image from "next/image";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { useEffect, useState } from "react";

type CountryImageProps = {
  countryId: string;
  className?: string;
};

/**
 * 国の画像を表示するコンポーネント
 * @param countryId 国ID (ISO 3166-1 alpha-3)
 */
export const CountryImage = ({ countryId, className }: CountryImageProps) => {
  const { getImageUrl, getCountryName } = useCountryData();
  const [imageUrl, setImageUrl] = useState("/default-globe.jpg"); // Default image
  const countryName = getCountryName(countryId);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      const url = await getImageUrl(countryId);
      if (isMounted) {
        setImageUrl(url);
      }
    };

    if (countryId) {
      fetchImage();
    }

    return () => {
      isMounted = false;
    };
  }, [countryId, getImageUrl]);

  return (
    <div
      className={
        className || "relative h-60 w-full overflow-hidden rounded-lg shadow-md"
      }
    >
      <Image
        src={imageUrl}
        alt={countryName ? `Image of ${countryName}` : "Country image"}
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
};
