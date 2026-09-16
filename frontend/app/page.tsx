"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import ConflictCard from "@/components/ConflictCard";
import LoadingState from "@/components/LoadingState";
import type { AnalysisResult } from "@/types";

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

  return (
    <main className="min-h-screen bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Contract Negotiator
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Upload two contracts and get AI-powered compromise suggestions for
            conflicting terms.
          </p>
        </header>

        {/* Upload Form */}
        <UploadForm
          onStartLoading={handleStartLoading}
          onSuccess={handleSuccess}
          onError={handleError}
          isLoading={loading}
        />

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error Alert */}
        {error && (
          <div className="bg-[#2a1a1a] border border-[#5a2020] rounded-xl p-4 text-sm text-[#ff6b6b] flex items-start gap-3">
            <span className="text-base leading-none">⚠️</span>
            <div className="space-y-1">
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs text-[#ff9999] leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section className="space-y-6 pt-4 animate-fadeIn">
            {/* Negotiation Summary */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Negotiation Summary
              </h2>
              <p className="text-sm text-neutral-200 leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Conflicts List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Conflicts & Compromises
                </h2>
                <span className="text-xs font-medium text-neutral-400 bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-1 rounded-full">
                  {result.conflicts.length}{" "}
                  {result.conflicts.length === 1 ? "clause" : "clauses"}
                </span>
              </div>

              {result.conflicts.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center text-sm text-neutral-400">
                  No direct conflicting clauses detected between the two contracts.
                </div>
              ) : (
                <div className="space-y-4">
                  {result.conflicts.map((conflict, index) => (
                    <ConflictCard key={index} conflict={conflict} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
