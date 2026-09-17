"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Parsing clauses & definitions from Party A and Party B...",
  "Cross-referencing liability, indemnification & payment covenants...",
  "Evaluating risk severity & identifying material deviations...",
  "Drafting balanced compromise clauses via Gemini AI...",
];

export default function LoadingState() {
  const [stageIndex, setStageIndex] = useState(0);
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 3200);

    const coldStartTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 7000);

    return () => {
      clearInterval(stageTimer);
      clearTimeout(coldStartTimer);
    };
  }, []);

  return (
    <div className="mx-6 sm:mx-10 my-8 space-y-6">
      {/* Header status bar */}
      <div className="bg-[#151824] border border-[#282f42] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        {/* Minimalist pulsing indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
          <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#94a3b8]">
            Analysis in Progress
          </span>
        </div>

        {/* Dynamic stage message */}
        <div className="space-y-2 max-w-lg">
          <p className="text-[14.5px] text-[#f8fafc] font-normal tracking-wide transition-all duration-300">
            {STAGES[stageIndex]}
          </p>
          {isWakingUp && (
            <p className="text-[12.5px] text-[#cbd5e1] font-normal leading-relaxed animate-fade-in border-t border-[#282f42] pt-3 mt-3">
              Still working — our server is waking up from sleep. This only happens on
              the first request and takes about 30 seconds. Your files are safe and
              processing.
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs h-[2px] bg-[#222838] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#38bdf8] to-[#818cf8] transition-all duration-700 ease-out"
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Skeleton placeholders mimicking Conflict Cards */}
      <div className="space-y-3 opacity-70">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="p-5 sm:p-6 bg-[#151824] border border-[#282f42] rounded-lg space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-[#22293b] rounded" />
              <div className="h-4 w-16 bg-[#1e2434] rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-[#1e2434] rounded" />
                <div className="h-12 bg-[#191e2b] rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-[#1e2434] rounded" />
                <div className="h-12 bg-[#191e2b] rounded" />
              </div>
            </div>
            <div className="h-14 bg-[#14261d] rounded border border-[#1b4d37]" />
          </div>
        ))}
      </div>
    </div>
  );
}

