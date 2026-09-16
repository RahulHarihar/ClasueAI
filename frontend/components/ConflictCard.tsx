import type { Conflict } from "@/types";

interface ConflictCardProps {
  conflict: Conflict;
}

export default function ConflictCard({ conflict }: ConflictCardProps) {
  const getRiskStyles = (level: Conflict["riskLevel"]) => {
    switch (level) {
      case "high":
        return {
          border: "border-l-[#ef4444]",
          badgeBg: "bg-[#2a1a1a]",
          badgeText: "text-[#ef4444]",
        };
      case "medium":
        return {
          border: "border-l-[#f59e0b]",
          badgeBg: "bg-[#2a2010]",
          badgeText: "text-[#f59e0b]",
        };
      case "low":
      default:
        return {
          border: "border-l-[#22c55e]",
          badgeBg: "bg-[#1a2a1a]",
          badgeText: "text-[#22c55e]",
        };
    }
  };

  const risk = getRiskStyles(conflict.riskLevel);

  return (
    <div
      className={`bg-[#1a1a1a] rounded-xl p-6 border-l-4 ${risk.border} border border-[#2a2a2a] space-y-4`}
    >
      {/* Header with topic, risk badge, and legal review flag */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white tracking-tight">
          {conflict.topic}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider ${risk.badgeBg} ${risk.badgeText}`}
          >
            {conflict.riskLevel} risk
          </span>
          {conflict.requiresLegalReview && (
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#1a1a2a] text-[#818cf8] tracking-wider">
              Requires Legal Review
            </span>
          )}
        </div>
      </div>

      {/* Clause Grid: Party A vs Party B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111111] rounded-lg p-4 space-y-1.5 border border-[#222222]">
          <h4 className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
            Party A
          </h4>
          <p className="text-sm text-[#cccccc] leading-relaxed">
            {conflict.partyA}
          </p>
        </div>
        <div className="bg-[#111111] rounded-lg p-4 space-y-1.5 border border-[#222222]">
          <h4 className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
            Party B
          </h4>
          <p className="text-sm text-[#cccccc] leading-relaxed">
            {conflict.partyB}
          </p>
        </div>
      </div>

      {/* The Conflict */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
          The Conflict
        </h4>
        <p className="text-sm text-[#aaaaaa] leading-relaxed">
          {conflict.conflict}
        </p>
      </div>

      {/* Suggested Compromise */}
      <div className="bg-[#0f1f0f] border border-[#1a3a1a] rounded-lg p-4 space-y-1">
        <h4 className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider">
          Suggested Compromise
        </h4>
        <p className="text-sm text-[#86efac] leading-relaxed font-normal">
          {conflict.compromise}
        </p>
      </div>
    </div>
  );
}
