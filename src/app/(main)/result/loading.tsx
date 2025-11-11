"use client";

import dynamic from "next/dynamic";

const Loading = dynamic(() => import("@/components/ui/Loading"), { ssr: false });

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center loader">
      <Loading />
    </div>
  );
}
