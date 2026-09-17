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
        return "bg-[#371616] text-[#fca5a5] border border-[#7f1d1d]";
      case "medium":
        return "bg-[#33220a] text-[#fcd34d] border border-[#78480b]";
      case "low":
      default:
        return "bg-[#132d1d] text-[#86efac] border border-[#166534]";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] border border-[#282e3d] hover:border-[#3d465c] transition-colors rounded-lg overflow-hidden bg-[#141824] shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
      {/* Sidebar */}
      <div className="p-6 bg-[#161a26] border-b md:border-b-0 md:border-r border-[#282e3d] flex flex-col justify-between gap-4">
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
              <span className="text-[10px] tracking-[0.08em] uppercase py-1 px-2 rounded-[2px] font-medium inline-block w-fit bg-[#241a44] text-[#c4b5fd] border border-[#4c2889]">
                Legal Review
              </span>
            )}
          </div>
          <h3 className="font-serif text-[18px] text-[#f8fafc] leading-[1.3] font-normal tracking-tight">
            {conflict.topic}
          </h3>
        </div>

        <div className="text-[11px] text-[#94a3b8] uppercase tracking-[0.08em] font-medium hidden md:block">
          Clause Analysis
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3.5 bg-[#12151f]">
        {/* Clauses Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#181d28] border border-[#282f42] rounded-md p-4 space-y-2">
            <div className="text-[10.5px] text-[#94a3b8] tracking-[0.08em] uppercase font-medium">
              Party A Version
            </div>
            <p className="text-[13px] text-[#cbd5e1] leading-[1.65] font-normal">
              {conflict.partyA}
            </p>
          </div>
          <div className="bg-[#181d28] border border-[#282f42] rounded-md p-4 space-y-2">
            <div className="text-[10.5px] text-[#94a3b8] tracking-[0.08em] uppercase font-medium">
              Party B Version
            </div>
            <p className="text-[13px] text-[#cbd5e1] leading-[1.65] font-normal">
              {conflict.partyB}
            </p>
          </div>
        </div>

        {/* Conflict description */}
        {conflict.conflict && (
          <div className="bg-[#181c28] border border-[#282e3e] rounded-md px-4 py-3 text-[13px] text-[#e2e8f0] leading-[1.65]">
            <span className="text-[10.5px] text-[#93c5fd] uppercase tracking-[0.08em] mr-2 font-medium">
              The Issue:
            </span>
            {conflict.conflict}
          </div>
        )}

        {/* Compromise */}
        <div className="bg-[#0d261c] border border-[#1b5037] rounded-md p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#6ee7b7] tracking-[0.08em] uppercase font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              Suggested Compromise
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11.5px] text-[#a7f3d0] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-normal px-2.5 py-1 rounded bg-[#133c2a] hover:bg-[#1a4d37] border border-[#22573d]"
            >
              {copied ? (
                <>
                  <span className="text-[#34d399]">✓</span>
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <span>Copy clause</span>
                  <span className="text-[11px] text-[#6ee7b7]">↗</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[13px] text-[#d1fae5] leading-[1.65] font-normal">
            {conflict.compromise}
          </p>
        </div>
      </div>
    </div>
  );
}
