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
        className={`bg-[#151824] border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
          isDraggingA
            ? "border-[#38bdf8] bg-[#162032]"
            : contractA
            ? "border-[#333c52] hover:border-[#475569]"
            : "border-[#252c3d] hover:border-[#38435c]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10.5px] tracking-[0.1em] uppercase text-[#94a3b8] font-medium">
            Your contract — Party A
          </span>
          {contractA && (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.05em] text-[#86efac] bg-[#142e1d] border border-[#166534] px-2.5 py-0.5 rounded font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Loaded
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center min-h-[90px] py-4 border border-dashed rounded transition-colors gap-2 mb-3 ${
            isDraggingA
              ? "border-[#38bdf8] bg-[#162032]"
              : contractA
              ? "border-[#333c52] bg-[#171b28]"
              : "border-[#2a3245] bg-[#121520] group-hover:border-[#38435d]"
          }`}
        >
          <span className="text-xl opacity-85 group-hover:opacity-100 transition-opacity">
            {contractA ? "📑" : "📄"}
          </span>
          <span className="text-[13px] text-[#cbd5e1] text-center px-3 truncate max-w-full font-normal">
            {contractA ? contractA.name : "Drop PDF or click to browse"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] text-[#94a3b8] tracking-wide font-normal">
          <span>
            {contractA
              ? `${(contractA.size / (1024 * 1024)).toFixed(2)} MB · PDF`
              : "PDF · Max 10MB"}
          </span>
          {contractA && (
            <span className="text-[11.5px] text-[#cbd5e1] hover:text-[#f8fafc] transition-colors">
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
        className={`bg-[#151824] border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
          isDraggingB
            ? "border-[#38bdf8] bg-[#162032]"
            : contractB
            ? "border-[#333c52] hover:border-[#475569]"
            : "border-[#252c3d] hover:border-[#38435c]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10.5px] tracking-[0.1em] uppercase text-[#94a3b8] font-medium">
            Counterparty contract — Party B
          </span>
          {contractB && (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.05em] text-[#86efac] bg-[#142e1d] border border-[#166534] px-2.5 py-0.5 rounded font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Loaded
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center min-h-[90px] py-4 border border-dashed rounded transition-colors gap-2 mb-3 ${
            isDraggingB
              ? "border-[#38bdf8] bg-[#162032]"
              : contractB
              ? "border-[#333c52] bg-[#171b28]"
              : "border-[#2a3245] bg-[#121520] group-hover:border-[#38435d]"
          }`}
        >
          <span className="text-xl opacity-85 group-hover:opacity-100 transition-opacity">
            {contractB ? "📑" : "📄"}
          </span>
          <span className="text-[13px] text-[#cbd5e1] text-center px-3 truncate max-w-full font-normal">
            {contractB ? contractB.name : "Drop PDF or click to browse"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] text-[#94a3b8] tracking-wide font-normal">
          <span>
            {contractB
              ? `${(contractB.size / (1024 * 1024)).toFixed(2)} MB · PDF`
              : "PDF · Max 10MB"}
          </span>
          {contractB && (
            <span className="text-[11.5px] text-[#cbd5e1] hover:text-[#f8fafc] transition-colors">
              Replace
            </span>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !contractA || !contractB}
        className="col-span-1 sm:col-span-2 bg-[#f8fafc] text-[#0f172a] border-0 py-3.5 px-6 rounded text-[13px] font-medium tracking-[0.02em] cursor-pointer hover:bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] active:scale-[0.995] disabled:opacity-30 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
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
