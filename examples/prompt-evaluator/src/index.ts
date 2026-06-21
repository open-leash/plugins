import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any, capabilities: any) {
  if (!input.config?.enabled) {
    return {
      status: "skipped",
      summary: "Prompt Evaluator is disabled."
    };
  }

  const prompt = String(input.prompt ?? "");
  const score = prompt.match(/drop\s+table|production|secret|token|credential/i) ? 85 : 10;
  const threshold = Number(input.config?.riskThreshold ?? 70);
  const scope = {
    sessionId: input.event?.sessionId,
    conversationId: input.event?.conversationId
  };

  await capabilities.storage.set({
    scope,
    key: "risk/latest",
    value: { score, at: Date.now() },
    ttlSeconds: 7 * 24 * 60 * 60
  });

  if (score < threshold) {
    return {
      status: "passed",
      summary: "Prompt risk is below threshold.",
      metadata: { score }
    };
  }

  const dedupeKey = "notifications/high-risk-prompt";
  const previous = await capabilities.storage.get({ scope, key: dedupeKey });

  if (!previous) {
    await capabilities.notification.send({
      title: "Prompt needs review",
      body: "A high-risk prompt was held for approval."
    });

    await capabilities.storage.set({
      scope,
      key: dedupeKey,
      value: { shownAt: Date.now(), score },
      ttlSeconds: 5 * 60 * 60
    });
  }

  return {
    status: "needs_question",
    summary: "Prompt risk is above threshold.",
    findings: [{
      title: "High-risk prompt",
      severity: "high",
      summary: "Prompt matched risky intent patterns.",
      evidence: [prompt.slice(0, 200)]
    }],
    metadata: { score }
  };
}

