export type RiskLevel = "low" | "medium" | "high";

export type Conflict = {
  topic: string;
  partyA: string;
  partyB: string;
  conflict: string;
  compromise: string;
  riskLevel: RiskLevel;
  requiresLegalReview: boolean;
};

export type AnalysisResult = {
  conflicts: Conflict[];
  summary: string;
};
