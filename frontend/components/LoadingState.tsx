"use client";

import { useEffect, useState } from "react";

export default function LoadingState() {
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowColdStartMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 my-6 flex flex-col items-center justify-center text-center space-y-4">
      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-neutral-700 border-t-white animate-spin" />
      </div>

      <div className="space-y-2 max-w-md">
        <p className="text-white font-medium text-base">
          Analyzing contracts with Gemini...
        </p>
        <p className="text-sm text-neutral-400">
          Extracting clauses, identifying conflicting terms, and drafting compromise suggestions.
        </p>

        {showColdStartMessage && (
          <div className="mt-4 p-3 bg-[#241f15] border border-[#4d3a1e] rounded-lg text-xs text-[#f59e0b] leading-relaxed animate-fadeIn">
            Our server is waking up — this takes about 30 seconds on first load.
            Your contracts have not been uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
