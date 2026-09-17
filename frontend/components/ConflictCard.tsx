"use client";

import { useState } from "react";
import type { Conflict } from "@/types";

interface ConflictCardProps {
  conflict: Conflict;
}

export default function ConflictCard({ conflict }: ConflictCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(conflict.compromise);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy compromise text:", err);
    }
  };

  const getRiskStyles = (level: Conflict["riskLevel"]) => {
    switch (level) {
      case "high":
        return "bg-[#240b0b] text-[#fca5a5] border border-[#571818]";
      case "medium":
        return "bg-[#241705] text-[#fcd34d] border border-[#57360a]";
      case "low":
      default:
        return "bg-[#0c1f12] text-[#86efac] border border-[#1b4d29]";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] border border-[#242422] hover:border-[#3a3a36] transition-colors rounded-lg overflow-hidden bg-[#121212] shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
      {/* Sidebar */}
      <div className="p-6 bg-[#141414] border-b md:border-b-0 md:border-r border-[#242422] flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`text-[10px] tracking-[0.08em] uppercase py-1 px-2 rounded-[2px] font-medium inline-block w-fit ${getRiskStyles(
                conflict.riskLevel
              )}`}
            >
              {conflict.riskLevel} risk
            </span>
            {conflict.requiresLegalReview && (
              <span className="text-[10px] tracking-[0.08em] uppercase py-1 px-2 rounded-[2px] font-medium inline-block w-fit bg-[#1c1a16] text-[#dfbe82] border border-[#4a3f2b]">
                Legal Review
              </span>
            )}
          </div>
          <h3 className="font-serif text-[18px] text-[#f0ede8] leading-[1.3] font-normal tracking-tight">
            {conflict.topic}
          </h3>
        </div>

        <div className="text-[11px] text-[#9e998e] uppercase tracking-[0.08em] font-medium hidden md:block">
          Clause Analysis
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3.5 bg-[#0f0f0f]">
        {/* Clauses Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#181818] border border-[#262624] rounded-md p-4 space-y-2">
            <div className="text-[10.5px] text-[#9e998e] tracking-[0.08em] uppercase font-medium">
              Party A Version
            </div>
            <p className="text-[13px] text-[#d4d0c7] leading-[1.65] font-normal">
              {conflict.partyA}
            </p>
          </div>
          <div className="bg-[#181818] border border-[#262624] rounded-md p-4 space-y-2">
            <div className="text-[10.5px] text-[#9e998e] tracking-[0.08em] uppercase font-medium">
              Party B Version
            </div>
            <p className="text-[13px] text-[#d4d0c7] leading-[1.65] font-normal">
              {conflict.partyB}
            </p>
          </div>
        </div>

        {/* Conflict description */}
        {conflict.conflict && (
          <div className="bg-[#181818] border border-[#262624] rounded-md px-4 py-3 text-[13px] text-[#e8e4db] leading-[1.65]">
            <span className="text-[10.5px] text-[#dfbe82] uppercase tracking-[0.08em] mr-2 font-medium">
              The Issue:
            </span>
            {conflict.conflict}
          </div>
        )}

        {/* Compromise */}
        <div className="bg-[#091a0e] border border-[#173821] rounded-md p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#86efac] tracking-[0.08em] uppercase font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              Suggested Compromise
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11.5px] text-[#bbf7d0] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-normal px-2.5 py-1 rounded bg-[#14331e] hover:bg-[#1a4428] border border-[#245432]"
            >
              {copied ? (
                <>
                  <span className="text-[#4ade80]">✓</span>
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <span>Copy clause</span>
                  <span className="text-[11px] text-[#86efac]">↗</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[13px] text-[#dcfce7] leading-[1.65] font-normal">
            {conflict.compromise}
          </p>
        </div>
      </div>
    </div>
  );
}
