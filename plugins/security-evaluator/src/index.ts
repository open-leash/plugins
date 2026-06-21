import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any, capabilities: any) {
  const startedAt = Date.now();
  const config = input.config ?? manifest.defaultConfig;

  if (!config.enabled) {
    return {
      status: "skipped",
      summary: "Security Evaluator is disabled.",
      startedAt
    };
  }

  const { results, model } = await capabilities.security.evaluatePolicies({
    request: input.request,
    policies: input.policies,
    policySet: config.policySet
  });

  const failed = results.filter((result: any) => result.status === "failed" || result.status === "needs_question");
  const status = failed.some((result: any) => result.status === "failed")
    ? "blocked"
    : failed.length
      ? "needs_question"
      : "passed";

  if (status === "needs_question" && capabilities.notification) {
    await capabilities.notification.send({
      title: "OpenLeash review needed",
      body: `${failed.length} policy result${failed.length === 1 ? "" : "s"} need review.`
    });
  }

  return {
    status,
    summary: failed.length
      ? `${failed.length} policy result${failed.length === 1 ? "" : "s"} need review.`
      : "All active policies passed.",
    startedAt,
    findings: failed.map((result: any) => ({
      title: result.policyName,
      severity: result.severity,
      summary: result.explanation,
      evidence: result.evidence
    })),
    metadata: { model }
  };
}

