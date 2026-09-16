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
        return "bg-[#1a0a0a] text-[#e05252] border border-[#331414]";
      case "medium":
        return "bg-[#1a1200] text-[#d99014] border border-[#332200]";
      case "low":
      default:
        return "bg-[#0a1a0a] text-[#4ea84e] border border-[#123312]";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] border border-[#1a1a1a] hover:border-[#262626] transition-colors rounded-lg overflow-hidden bg-[#0c0c0c]">
      {/* Sidebar */}
      <div className="p-6 bg-[#101010] border-b md:border-b-0 md:border-r border-[#1a1a1a] flex flex-col justify-between gap-4">
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
              <span className="text-[10px] tracking-[0.08em] uppercase py-1 px-2 rounded-[2px] font-medium inline-block w-fit bg-[#140e24] text-[#b388ff] border border-[#2b1852]">
                Legal Review
              </span>
            )}
          </div>
          <h3 className="font-serif text-[17px] text-[#f0ede8] leading-[1.3] font-normal tracking-tight">
            {conflict.topic}
          </h3>
        </div>

        <div className="text-[10px] text-[#444] uppercase tracking-[0.06em] hidden md:block">
          Clause Analysis
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3.5 bg-[#0c0c0c]">
        {/* Clauses Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-[#0e0e0e] border border-[#181818] rounded-md p-3.5 space-y-1.5">
            <div className="text-[10px] text-[#555] tracking-[0.08em] uppercase font-medium">
              Party A Version
            </div>
            <p className="text-[12.5px] text-[#888] leading-[1.6] font-light">
              {conflict.partyA}
            </p>
          </div>
          <div className="bg-[#0e0e0e] border border-[#181818] rounded-md p-3.5 space-y-1.5">
            <div className="text-[10px] text-[#555] tracking-[0.08em] uppercase font-medium">
              Party B Version
            </div>
            <p className="text-[12.5px] text-[#888] leading-[1.6] font-light">
              {conflict.partyB}
            </p>
          </div>
        </div>

        {/* Conflict description */}
        {conflict.conflict && (
          <div className="px-1 text-[12px] text-[#666] leading-[1.6] font-light">
            <span className="text-[10px] text-[#444] uppercase tracking-[0.08em] mr-2 font-medium">
              The Issue:
            </span>
            {conflict.conflict}
          </div>
        )}

        {/* Compromise */}
        <div className="bg-[#071207] border border-[#112411] rounded-md p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#3e783e] tracking-[0.08em] uppercase font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3e783e]" />
              Suggested Compromise
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] text-[#4e8c4e] hover:text-[#78b378] transition-colors flex items-center gap-1.5 cursor-pointer font-light px-2 py-0.5 rounded bg-[#0d210d]/50 hover:bg-[#0d210d]"
            >
              {copied ? (
                <>
                  <span className="text-[#78b378]">✓</span>
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <span>Copy clause</span>
                  <span className="text-[10px] text-[#3e783e]">↗</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[12.5px] text-[#78b378] leading-[1.6] font-light">
            {conflict.compromise}
          </p>
        </div>
      </div>
    </div>
  );
}
