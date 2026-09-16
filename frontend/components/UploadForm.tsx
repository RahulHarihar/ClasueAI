"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types";

interface UploadFormProps {
  onStartLoading: () => void;
  onSuccess: (result: AnalysisResult) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export default function UploadForm({
  onStartLoading,
  onSuccess,
  onError,
  isLoading,
}: UploadFormProps) {
  const [contractA, setContractA] = useState<File | null>(null);
  const [contractB, setContractB] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractA || !contractB || isLoading) return;

    onStartLoading();

    const formData = new FormData();
    formData.append("contractA", contractA);
    formData.append("contractB", contractB);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/api/negotiate`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as AnalysisResult | { error?: string };

      if (!res.ok) {
        const errorMsg =
          "error" in data && typeof data.error === "string"
            ? data.error
            : `Failed to analyze contracts (HTTP ${res.status})`;
        onError(errorMsg);
        return;
      }

      if (!("conflicts" in data) || !("summary" in data)) {
        onError("Unexpected response format from server");
        return;
      }

      onSuccess(data);
    } catch (err) {
      console.error("Upload error:", err);
      onError(
        "Could not connect to the backend server. If using Render free tier, the instance may be spinning up."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Party A Zone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Your Contract (Party A)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              disabled={isLoading}
              onChange={(e) => setContractA(e.target.files?.[0] || null)}
              required
              className="w-full text-sm text-neutral-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 bg-[#111] border border-dashed border-[#333] rounded-lg p-3 cursor-pointer focus:outline-none focus:border-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {contractA && (
            <p className="text-xs text-neutral-400 truncate">
              Selected: <span className="text-neutral-200">{contractA.name}</span>
            </p>
          )}
        </div>

        {/* Party B Zone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Counterparty Contract (Party B)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              disabled={isLoading}
              onChange={(e) => setContractB(e.target.files?.[0] || null)}
              required
              className="w-full text-sm text-neutral-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 bg-[#111] border border-dashed border-[#333] rounded-lg p-3 cursor-pointer focus:outline-none focus:border-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {contractB && (
            <p className="text-xs text-neutral-400 truncate">
              Selected: <span className="text-neutral-200">{contractB.name}</span>
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !contractA || !contractB}
        className="w-full py-3.5 px-4 bg-white text-black font-semibold rounded-lg text-sm hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
      >
        {isLoading ? "Analyzing contracts..." : "Negotiate"}
      </button>
    </form>
  );
}
