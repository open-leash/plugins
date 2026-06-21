import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any) {
  const startedAt = Date.now();
  const config = input.config ?? manifest.defaultConfig;

  if (!config.enabled) {
    return {
      status: "skipped",
      summary: "Skill Scanner is disabled.",
      startedAt
    };
  }

  const riskScore = Math.max(0, Math.min(100, Number(input.riskScore ?? 0)));
  const reasons = Array.isArray(input.reasons) ? input.reasons : [];
  const suspicious = input.status === "suspicious" ||
    reasons.length > 0 ||
    riskScore >= Number(config.suspiciousRiskThreshold ?? 50);

  return {
    status: suspicious ? "needs_question" : "passed",
    summary: suspicious
      ? "Skill scanner found behavior that needs review."
      : "Skill scanner observed the skill without suspicious findings.",
    startedAt,
    findings: reasons.map((reason: any) => ({
      title: "Suspicious skill behavior",
      severity: "high",
      summary: reason.reason,
      evidence: reason.quote ? [reason.quote] : undefined
    })),
    metadata: {
      skillName: input.skillName,
      skillPath: input.skillPath,
      riskScore: suspicious && riskScore === 0 ? 70 : riskScore
    }
  };
}

