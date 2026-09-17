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
        className={`bg-[#141414] border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
          isDraggingA
            ? "border-[#c5a059] bg-[#1c1913]"
            : contractA
            ? "border-[#30302c] hover:border-[#42423d]"
            : "border-[#242422] hover:border-[#383835]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10.5px] tracking-[0.1em] uppercase text-[#9e998e] font-medium">
            Your contract — Party A
          </span>
          {contractA && (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.05em] text-[#86efac] bg-[#0c1f12] border border-[#1b4d29] px-2.5 py-0.5 rounded font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Loaded
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center min-h-[90px] py-4 border border-dashed rounded transition-colors gap-2 mb-3 ${
            isDraggingA
              ? "border-[#c5a059] bg-[#211d15]"
              : contractA
              ? "border-[#30302c] bg-[#181818]"
              : "border-[#222220] bg-[#0f0f0f] group-hover:border-[#333330]"
          }`}
        >
          <span className="text-xl opacity-85 group-hover:opacity-100 transition-opacity">
            {contractA ? "📑" : "📄"}
          </span>
          <span className="text-[13px] text-[#d4d0c7] text-center px-3 truncate max-w-full font-normal">
            {contractA ? contractA.name : "Drop PDF or click to browse"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] text-[#9e998e] tracking-wide font-normal">
          <span>
            {contractA
              ? `${(contractA.size / (1024 * 1024)).toFixed(2)} MB · PDF`
              : "PDF · Max 10MB"}
          </span>
          {contractA && (
            <span className="text-[11.5px] text-[#c5a059] hover:text-[#dfbe82] transition-colors">
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
        className={`bg-[#141414] border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
          isDraggingB
            ? "border-[#c5a059] bg-[#1c1913]"
            : contractB
            ? "border-[#30302c] hover:border-[#42423d]"
            : "border-[#242422] hover:border-[#383835]"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10.5px] tracking-[0.1em] uppercase text-[#9e998e] font-medium">
            Counterparty contract — Party B
          </span>
          {contractB && (
            <span className="inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.05em] text-[#86efac] bg-[#0c1f12] border border-[#1b4d29] px-2.5 py-0.5 rounded font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Loaded
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center min-h-[90px] py-4 border border-dashed rounded transition-colors gap-2 mb-3 ${
            isDraggingB
              ? "border-[#c5a059] bg-[#211d15]"
              : contractB
              ? "border-[#30302c] bg-[#181818]"
              : "border-[#222220] bg-[#0f0f0f] group-hover:border-[#333330]"
          }`}
        >
          <span className="text-xl opacity-85 group-hover:opacity-100 transition-opacity">
            {contractB ? "📑" : "📄"}
          </span>
          <span className="text-[13px] text-[#d4d0c7] text-center px-3 truncate max-w-full font-normal">
            {contractB ? contractB.name : "Drop PDF or click to browse"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11.5px] text-[#9e998e] tracking-wide font-normal">
          <span>
            {contractB
              ? `${(contractB.size / (1024 * 1024)).toFixed(2)} MB · PDF`
              : "PDF · Max 10MB"}
          </span>
          {contractB && (
            <span className="text-[11.5px] text-[#c5a059] hover:text-[#dfbe82] transition-colors">
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
