import { Suspense } from "react";
import { ResultPageClient } from "./ResultPageClient";

const ResultPage = () => {
  return (
    <Suspense
      fallback={<div className="text-center p-8">Loading results...</div>}
    >
      <ResultPageClient />
    </Suspense>
  );
};

export default ResultPage;
