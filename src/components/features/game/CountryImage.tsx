"use client";

import Image from "next/image";
import { useCountryData } from "@/lib/hooks/useCountryData";
import { useEffect, useState } from "react";

type CountryImageProps = {
  countryId: string;
  /** containerClassName must include `relative` for next/image fill to work correctly. */
  className?: string;
};

/**
 * 国の画像を表示するコンポーネント
 * @param countryId 国ID (ISO 3166-1 alpha-3)
 */
export const CountryImage = ({ countryId, className }: CountryImageProps) => {
  const { getImageUrl, getCountryName } = useCountryData();
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Initial state is null
  const countryName = getCountryName(countryId);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      // Reset to null when countryId changes to show loading state
      setImageUrl(null);
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

  const containerClassName =
    className || "relative h-60 w-full overflow-hidden rounded-lg shadow-md";

  return (
    <div className={containerClassName}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={countryName ? `Image of ${countryName}` : "Country image"}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      ) : (
        // Loading state
        <div className="w-full h-full bg-slate-200 animate-pulse"></div>
      )}
    </div>
  );
};
