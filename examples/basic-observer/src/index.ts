import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any, capabilities: any) {
  if (!input.config?.enabled) {
    return {
      status: "skipped",
      summary: "Basic Observer is disabled."
    };
  }

  await capabilities.storage.set({
    scope: { sessionId: input.event?.sessionId },
    key: "prompts/latest-length",
    value: {
      length: String(input.prompt ?? "").length,
      at: Date.now()
    },
    ttlSeconds: 24 * 60 * 60
  });

  return {
    status: "passed",
    summary: "Prompt length observed.",
    metadata: {
      promptLength: String(input.prompt ?? "").length
    }
  };
}

