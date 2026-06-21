import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any, capabilities: any) {
  const startedAt = Date.now();
  const prompt = String(input.prompt ?? "");
  const config = input.config ?? manifest.defaultConfig;

  if (!config.enabled) {
    return {
      status: "skipped",
      summary: "DLP is disabled.",
      startedAt
    };
  }

  const inspected = await capabilities.dlp.inspect({
    prompt,
    action: config.action,
    categories: config.categories,
    model: config.model
  });

  return {
    status: inspected.blocked ? "blocked" : inspected.masked ? "modified" : "passed",
    summary: inspected.matched
      ? `DLP matched ${inspected.categories.join(", ") || "sensitive data"}.`
      : "DLP checked with no sensitive data detected.",
    prompt: inspected.prompt,
    blocked: inspected.blocked,
    startedAt,
    findings: inspected.findings?.map((finding: any) => ({
      title: `${String(finding.category).toUpperCase()} detected`,
      severity: inspected.blocked ? "high" : "medium",
      summary: finding.reason,
      evidence: finding.quote ? [finding.quote] : undefined
    })),
    metadata: {
      model: inspected.model,
      categories: inspected.categories,
      masked: inspected.masked
    }
  };
}

