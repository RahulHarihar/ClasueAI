"use client";

import { useRef, useState } from "react";
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
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);

  const fileInputARef = useRef<HTMLInputElement | null>(null);
  const fileInputBRef = useRef<HTMLInputElement | null>(null);

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

  const handleDropA = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingA(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setContractA(file);
    }
  };

  const handleDropB = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingB(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setContractB(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* Hidden file inputs — must live outside the clickable divs to avoid double-trigger bubbling */}
      <input
        ref={fileInputARef}
        type="file"
        accept=".pdf"
        disabled={isLoading}
        onChange={(e) => setContractA(e.target.files?.[0] || null)}
        className="hidden"
        aria-label="Upload Party A contract PDF"
      />
      <input
        ref={fileInputBRef}
        type="file"
        accept=".pdf"
        disabled={isLoading}
        onChange={(e) => setContractB(e.target.files?.[0] || null)}
        className="hidden"
        aria-label="Upload Party B contract PDF"
      />

      {/* Upload Card Party A */}
      <div
        onClick={() => fileInputARef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingA(true);
        }}
        onDragLeave={() => setIsDraggingA(false)}
        onDrop={handleDropA}
        className={`bg-[#121212] border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
          isDraggingA
            ? "border-[#4ade80] bg-[#141814]"
            : contractA
            ? "border-[#262626] hover:border-[#383838]"
            : "border-[#1c1c1c] hover:border-[#2a2a2a]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#666] font-medium">
            Your contract — Party A
          </span>
          {contractA && (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.05em] text-[#4ade80] bg-[#0a160a] border border-[#163016] px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Loaded
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center min-h-[90px] py-4 border border-dashed rounded transition-colors gap-2 mb-3 ${
            isDraggingA
              ? "border-[#4ade80] bg-[#162216]"
              : contractA
              ? "border-[#2c2c2c] bg-[#0d0d0d]"
              : "border-[#222] bg-[#0a0a0a] group-hover:border-[#333]"
          }`}
        >
          <span className="text-xl opacity-75 group-hover:opacity-100 transition-opacity">
            {contractA ? "📑" : "📄"}
          </span>
          <span className="text-[12px] text-[#888] text-center px-3 truncate max-w-full font-light">
            {contractA ? contractA.name : "Drop PDF or click to browse"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#444] tracking-wide">
          <span>
            {contractA
              ? `${(contractA.size / (1024 * 1024)).toFixed(2)} MB · PDF`
              : "PDF · Max 10MB"}
          </span>
          {contractA && (
            <span className="text-[11px] text-[#666] hover:text-[#aaa] transition-colors">
              Replace
            </span>
          )}
        </div>
      </div>

      {/* Upload Card Party B */}
      <div
        onClick={() => fileInputBRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingB(true);
        }}
        onDragLeave={() => setIsDraggingB(false)}
        onDrop={handleDropB}
        className={`bg-[#121212] border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
          isDraggingB
            ? "border-[#4ade80] bg-[#141814]"
            : contractB
            ? "border-[#262626] hover:border-[#383838]"
            : "border-[#1c1c1c] hover:border-[#2a2a2a]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#666] font-medium">
            Counterparty contract — Party B
          </span>
          {contractB && (
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.05em] text-[#4ade80] bg-[#0a160a] border border-[#163016] px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Loaded
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center min-h-[90px] py-4 border border-dashed rounded transition-colors gap-2 mb-3 ${
            isDraggingB
              ? "border-[#4ade80] bg-[#162216]"
              : contractB
              ? "border-[#2c2c2c] bg-[#0d0d0d]"
              : "border-[#222] bg-[#0a0a0a] group-hover:border-[#333]"
          }`}
        >
          <span className="text-xl opacity-75 group-hover:opacity-100 transition-opacity">
            {contractB ? "📑" : "📄"}
          </span>
          <span className="text-[12px] text-[#888] text-center px-3 truncate max-w-full font-light">
            {contractB ? contractB.name : "Drop PDF or click to browse"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#444] tracking-wide">
          <span>
            {contractB
              ? `${(contractB.size / (1024 * 1024)).toFixed(2)} MB · PDF`
              : "PDF · Max 10MB"}
          </span>
          {contractB && (
            <span className="text-[11px] text-[#666] hover:text-[#aaa] transition-colors">
              Replace
            </span>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !contractA || !contractB}
        className="col-span-1 sm:col-span-2 bg-[#f0ede8] text-[#0c0c0c] border-0 py-3.5 px-6 rounded text-[13px] font-medium tracking-[0.02em] cursor-pointer hover:bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.995] disabled:opacity-30 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
            <span>Analyzing contracts...</span>
          </>
        ) : (
          <span>Analyze contracts →</span>
        )}
      </button>
    </form>
  );
}
