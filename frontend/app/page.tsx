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

  const [copiedReport, setCopiedReport] = useState(false);

  const handleStartLoading = () => {
    setLoading(true);
    setError(null);
    setResult(null);
  };

  const handleSuccess = (data: AnalysisResult) => {
    setResult(data);
    setLoading(false);
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
    setLoading(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  };

  const generateMarkdownReport = (data: AnalysisResult): string => {
    const lines = [
      "# Contract Negotiation Analysis Report",
      `*Generated via Contract Intelligence (Gemini AI) on ${new Date().toLocaleDateString()}*`,
      "",
      "## Executive Summary",
      data.summary,
      "",
      `## Identified Conflicts (${data.conflicts.length})`,
      "",
    ];

    data.conflicts.forEach((c, idx) => {
      lines.push(`### ${idx + 1}. ${c.topic} [Risk: ${c.riskLevel.toUpperCase()}]`);
      if (c.requiresLegalReview) {
        lines.push("> ⚠️ **Flag:** Formal legal counsel review recommended for this clause.\n");
      }
      lines.push(`**Party A Clause:**\n> ${c.partyA}\n`);
      lines.push(`**Party B Clause:**\n> ${c.partyB}\n`);
      lines.push(`**Conflict Analysis:**\n${c.conflict}\n`);
      lines.push(`**Proposed Compromise Language:**\n\`\`\`\n${c.compromise}\n\`\`\`\n`);
      lines.push("---\n");
    });

    return lines.join("\n");
  };

  const handleCopyReport = async () => {
    if (!result) return;
    try {
      const md = generateMarkdownReport(result);
      await navigator.clipboard.writeText(md);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const md = generateMarkdownReport(result);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contract-analysis-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sortedConflicts = result
    ? [...result.conflicts].sort(
        (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
      )
    : [];

  return (
    <div className="max-w-[1080px] mx-auto border-x border-[#222838] bg-[#0e1117] min-h-[calc(100vh-56px)] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
      {/* 1. Hero with 2-Column Balanced Layout */}
      <section className="px-6 sm:px-12 pt-16 sm:pt-20 pb-14 sm:pb-16 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        {/* Left Column: Typography & Actions */}
        <div className="max-w-[540px] space-y-6">
          <div className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.14em] uppercase text-[#94a3b8] font-medium">
            <div className="w-5 h-[1px] bg-[#475569]" />
            <span>Contract Intelligence</span>
            <span className="text-[#64748b]">·</span>
            <span className="text-[#cbd5e1] normal-case tracking-normal font-normal">
              Powered by Gemini AI
            </span>
          </div>

          <h1 className="font-serif text-[40px] sm:text-[56px] leading-[1.06] font-normal tracking-[-0.02em] text-[#f8fafc]">
            Two contracts.
            <br />
            <em className="italic text-[#cbd5e1]">One clear path</em>
            <br />
            forward.
          </h1>

          <p className="text-[15px] sm:text-[15.5px] text-[#cbd5e1] leading-[1.75] font-normal">
            Upload two versions of an agreement. Get a ranked breakdown of every
            conflict — complete with balanced compromise language, risk ratings,
            and flags for human legal review.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#f1f5f9] text-[#0f172a] text-[13px] font-medium rounded tracking-[0.02em] hover:bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.995]"
            >
              Try it free →
            </a>
            <div className="text-[12.5px] text-[#94a3b8] tracking-[0.02em] font-normal">
              No account required · Instant analysis
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Vector Diff Graphic */}
        <div className="flex justify-center lg:justify-end">
          <LegalHeroGraphic />
        </div>
      </section>

      <div className="w-full h-[1px] bg-[#222838]" />

      {/* 2. Feature Strip / How it works */}
      <section className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#222838]">
        <div className="p-8 sm:p-10 sm:border-r border-[#222838] border-b sm:border-b-0 hover:bg-[#12151f] transition-colors duration-200">
          <div className="text-[11.5px] text-[#818cf8] tracking-[0.1em] mb-4 font-mono font-semibold">
            01
          </div>
          <h3 className="font-serif text-[21px] font-normal text-[#f8fafc] mb-2 leading-[1.25]">
            Clause extraction
          </h3>
          <p className="text-[13.5px] text-[#cbd5e1] leading-[1.65] font-normal">
            Parses both PDFs and identifies individual clauses across payment,
            liability, IP, and termination.
          </p>
        </div>

        <div className="p-8 sm:p-10 sm:border-r border-[#222838] border-b sm:border-b-0 hover:bg-[#12151f] transition-colors duration-200">
          <div className="text-[11.5px] text-[#818cf8] tracking-[0.1em] mb-4 font-mono font-semibold">
            02
          </div>
          <h3 className="font-serif text-[21px] font-normal text-[#f8fafc] mb-2 leading-[1.25]">
            Conflict detection
          </h3>
          <p className="text-[13.5px] text-[#cbd5e1] leading-[1.65] font-normal">
            Surfaces every point of disagreement between the two versions,
            ranked from high to low risk.
          </p>
        </div>

        <div className="p-8 sm:p-10 hover:bg-[#12151f] transition-colors duration-200">
          <div className="text-[11.5px] text-[#818cf8] tracking-[0.1em] mb-4 font-mono font-semibold">
            03
          </div>
          <h3 className="font-serif text-[21px] font-normal text-[#f8fafc] mb-2 leading-[1.25]">
            Compromise drafting
          </h3>
          <p className="text-[13.5px] text-[#cbd5e1] leading-[1.65] font-normal">
            Generates balanced alternative language your legal team can use as
            a negotiation starting point.
          </p>
        </div>
      </section>

      {/* 3. Demo Section */}
      <section id="demo" className="bg-[#11141d] border-b border-[#222838]">
        <div className="px-6 sm:px-10 pt-10 sm:pt-12 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#222838] pb-5">
          <div className="text-[11px] tracking-[0.12em] uppercase text-[#94a3b8] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            Live Demo
          </div>
          <div className="text-[12.5px] text-[#94a3b8] font-normal">
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
          <div className="mx-6 sm:mx-10 mb-8 p-5 bg-[#241010] border border-[#521c1c] rounded-lg space-y-3">
            <span className="font-medium block text-[11px] uppercase tracking-wider text-[#fca5a5]">
              Analysis Error
            </span>
            <p className="text-[13.5px] text-[#fca5a5] font-normal leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 text-[12px] text-[#cbd5e1] hover:text-white transition-colors font-normal border border-[#521c1c] hover:border-[#782828] rounded px-3 py-1.5 cursor-pointer bg-[#351515]"
            >
              ← Try again
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="px-6 sm:px-10 pb-12 pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222838] pb-4 gap-3">
              <div>
                <div className="text-[11.5px] tracking-[0.12em] uppercase text-[#e2e8f0] font-medium">
                  Analysis Output — {sortedConflicts.length}{" "}
                  {sortedConflicts.length === 1 ? "conflict" : "conflicts"} detected
                </div>
                <div className="text-[11.5px] text-[#94a3b8] font-normal">
                  Ranked by risk level
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] text-[#cbd5e1] hover:text-[#f8fafc] border border-[#282f42] hover:border-[#3e485e] rounded bg-[#161a25] transition-all cursor-pointer font-normal"
                  title="Copy full analysis report as Markdown"
                >
                  <svg className="w-3.5 h-3.5 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span>{copiedReport ? "Report Copied ✓" : "Copy Report"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] text-[#cbd5e1] hover:text-[#f8fafc] border border-[#282f42] hover:border-[#3e485e] rounded bg-[#161a25] transition-all cursor-pointer font-normal"
                  title="Download full analysis report as Markdown file"
                >
                  <svg className="w-3.5 h-3.5 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export .md</span>
                </button>
              </div>
            </div>

            {/* Negotiation Summary */}
            <div className="p-5 sm:p-6 bg-[#151824] border border-[#282f42] rounded-lg space-y-2">
              <div className="text-[11px] uppercase tracking-[0.1em] text-[#94a3b8] font-semibold flex items-center gap-1.5">
                <span>Executive Summary</span>
              </div>
              <p className="text-[14px] text-[#e2e8f0] leading-[1.7] font-normal">
                {result.summary}
              </p>
            </div>

            {/* Conflict Rows */}
            {sortedConflicts.length === 0 ? (
              <div className="p-8 bg-[#151824] border border-[#282f42] rounded-lg text-center text-[13.5px] text-[#94a3b8] font-normal">
                No direct conflicting clauses detected between the two contracts.
              </div>
            ) : (
              <div className="space-y-3.5">
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
          <div className="font-serif text-[34px] text-[#f8fafc] font-normal leading-none">
            &lt; 30s
          </div>
          <div className="text-[12.5px] text-[#94a3b8] font-normal">
            Average analysis time
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-10 bg-[#222838]" />

        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="font-serif text-[34px] text-[#f8fafc] font-normal leading-none">
            Free
          </div>
          <div className="text-[12.5px] text-[#94a3b8] font-normal">
            No signup or credit card
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-10 bg-[#222838]" />

        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="font-serif text-[34px] text-[#f8fafc] font-normal leading-none">
            Gemini 3.6
          </div>
          <div className="text-[12.5px] text-[#94a3b8] font-normal">
            Google deep reasoning AI
          </div>
        </div>
      </section>
    </div>
  );
}
