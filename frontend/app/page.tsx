"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import ConflictCard from "@/components/ConflictCard";
import LoadingState from "@/components/LoadingState";
import LegalHeroGraphic from "@/components/LegalHeroGraphic";
import type { AnalysisResult } from "@/types";

const RISK_ORDER = { high: 0, medium: 1, low: 2 } as const;

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartLoading = () => {
    setLoading(true);
    setError(null);
    setResult(null);
  };

  const handleSuccess = (data: AnalysisResult) => {
    setResult(data);
    setLoading(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  };

  const sortedConflicts = result
    ? [...result.conflicts].sort(
        (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
      )
    : [];

  return (
    <div className="max-w-[1080px] mx-auto border-x border-[#222222] bg-[#0c0c0c] min-h-[calc(100vh-56px)] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      {/* 1. Hero with 2-Column Balanced Layout */}
      <section className="px-6 sm:px-12 pt-16 sm:pt-20 pb-14 sm:pb-16 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        {/* Left Column: Typography & Actions */}
        <div className="max-w-[540px] space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase text-[#777] font-medium">
            <div className="w-5 h-[1px] bg-[#3e3e3e]" />
            <span>Contract Intelligence</span>
            <span className="text-[#444]">·</span>
            <span className="text-[#666] normal-case tracking-normal font-light">
              Powered by Gemini AI
            </span>
          </div>

          <h1 className="font-serif text-[40px] sm:text-[56px] leading-[1.06] font-normal tracking-[-0.02em] text-[#f0ede8]">
            Two contracts.
            <br />
            <em className="italic text-[#888]">One clear path</em>
            <br />
            forward.
          </h1>

          <p className="text-[15px] sm:text-[15.5px] text-[#777] leading-[1.7] font-light">
            Upload two versions of an agreement. Get a ranked breakdown of every
            conflict — complete with balanced compromise language, risk ratings,
            and flags for human legal review.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#f0ede8] text-[#0c0c0c] text-[13px] font-medium rounded tracking-[0.02em] hover:bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.995]"
            >
              Try it free →
            </a>
            <div className="text-[12.5px] text-[#666] tracking-[0.02em] font-light">
              No account required · Instant analysis
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Vector Diff Graphic */}
        <div className="flex justify-center lg:justify-end">
          <LegalHeroGraphic />
        </div>
      </section>

      <div className="w-full h-[1px] bg-[#222222]" />

      {/* 2. Feature Strip / How it works */}
      <section className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#222222]">
        <div className="p-8 sm:p-10 sm:border-r border-[#222222] border-b sm:border-b-0 hover:bg-[#0f0f0f] transition-colors duration-200">
          <div className="text-[11px] text-[#555] tracking-[0.1em] mb-4 font-mono font-medium">
            01
          </div>
          <h3 className="font-serif text-[21px] font-normal text-[#f0ede8] mb-2 leading-[1.25]">
            Clause extraction
          </h3>
          <p className="text-[13px] text-[#666] leading-[1.6] font-light">
            Parses both PDFs and identifies individual clauses across payment,
            liability, IP, and termination.
          </p>
        </div>

        <div className="p-8 sm:p-10 sm:border-r border-[#222222] border-b sm:border-b-0 hover:bg-[#0f0f0f] transition-colors duration-200">
          <div className="text-[11px] text-[#555] tracking-[0.1em] mb-4 font-mono font-medium">
            02
          </div>
          <h3 className="font-serif text-[21px] font-normal text-[#f0ede8] mb-2 leading-[1.25]">
            Conflict detection
          </h3>
          <p className="text-[13px] text-[#666] leading-[1.6] font-light">
            Surfaces every point of disagreement between the two versions,
            ranked from high to low risk.
          </p>
        </div>

        <div className="p-8 sm:p-10 hover:bg-[#0f0f0f] transition-colors duration-200">
          <div className="text-[11px] text-[#555] tracking-[0.1em] mb-4 font-mono font-medium">
            03
          </div>
          <h3 className="font-serif text-[21px] font-normal text-[#f0ede8] mb-2 leading-[1.25]">
            Compromise drafting
          </h3>
          <p className="text-[13px] text-[#666] leading-[1.6] font-light">
            Generates balanced alternative language your legal team can use as
            a negotiation starting point.
          </p>
        </div>
      </section>

      {/* 3. Demo Section */}
      <section id="demo" className="bg-[#0f0f0f] border-b border-[#222222]">
        <div className="px-6 sm:px-10 pt-10 sm:pt-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#1c1c1c] pb-5">
          <div className="text-[11px] tracking-[0.12em] uppercase text-[#777] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#185fa5]" />
            Live Demo
          </div>
          <div className="text-[12px] text-[#555] font-light">
            Upload two PDFs · Results in under 30 seconds
          </div>
        </div>

        {/* Upload Form Component */}
        <UploadForm
          onStartLoading={handleStartLoading}
          onSuccess={handleSuccess}
          onError={handleError}
          isLoading={loading}
        />

        {/* Loading State Component */}
        {loading && <LoadingState />}

        {/* Error Notification */}
        {error && (
          <div className="mx-6 sm:mx-10 mb-8 p-4 bg-[#1a0a0a] border border-[#2a1010] rounded text-[13px] text-[#cc4444] space-y-1">
            <span className="font-medium block text-[11px] uppercase tracking-wider">
              Analysis Error
            </span>
            <p className="text-[#aa4444] font-light leading-relaxed">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="px-6 sm:px-10 pb-12 pt-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <div className="text-[11px] tracking-[0.12em] uppercase text-[#777] font-medium">
                Analysis Output — {sortedConflicts.length}{" "}
                {sortedConflicts.length === 1 ? "conflict" : "conflicts"} detected
              </div>
              <div className="text-[11px] text-[#555] font-light">
                Ranked by risk level
              </div>
            </div>

            {/* Negotiation Summary */}
            <div className="p-5 bg-[#121212] border border-[#222222] rounded-lg space-y-1.5">
              <div className="text-[10px] uppercase tracking-[0.1em] text-[#666] font-medium flex items-center gap-1.5">
                <span>Executive Summary</span>
              </div>
              <p className="text-[13px] text-[#bbb] leading-[1.6] font-light">
                {result.summary}
              </p>
            </div>

            {/* Conflict Rows */}
            {sortedConflicts.length === 0 ? (
              <div className="p-8 bg-[#121212] border border-[#222222] rounded-lg text-center text-[13px] text-[#666] font-light">
                No direct conflicting clauses detected between the two contracts.
              </div>
            ) : (
              <div className="space-y-3">
                {sortedConflicts.map((conflict, index) => (
                  <ConflictCard key={index} conflict={conflict} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Social Proof */}
      <section className="px-6 sm:px-10 py-12 flex flex-wrap items-center justify-between gap-8">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="font-serif text-[34px] text-[#f0ede8] font-normal leading-none">
            &lt; 30s
          </div>
          <div className="text-[12px] text-[#555] font-light">
            Average analysis time
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-10 bg-[#222222]" />

        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="font-serif text-[34px] text-[#f0ede8] font-normal leading-none">
            Free
          </div>
          <div className="text-[12px] text-[#555] font-light">
            No signup or credit card
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-10 bg-[#222222]" />

        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="font-serif text-[34px] text-[#f0ede8] font-normal leading-none">
            Gemini 3.6
          </div>
          <div className="text-[12px] text-[#555] font-light">
            Google deep reasoning AI
          </div>
        </div>
      </section>
    </div>
  );
}
