import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any, capabilities: any) {
  const startedAt = Date.now();
  const prompt = String(input.prompt ?? "");
  const config = input.config ?? manifest.defaultConfig;

  if (!config.enabled) {
    return {
      status: "skipped",
      summary: "Prompt compression is disabled.",
      startedAt
    };
  }

  const compressed = await capabilities.prompt.compress({
    prompt,
    level: config.level,
    conciseResponse: config.conciseResponse,
    model: config.model
  });

  return {
    status: compressed.prompt !== prompt ? "modified" : "passed",
    summary: compressed.prompt !== prompt
      ? `Prompt compressed from ${compressed.originalLength} to ${compressed.compressedLength} chars.`
      : "Prompt compression checked with no changes.",
    prompt: compressed.prompt,
    startedAt,
    metadata: {
      model: compressed.model,
      compression: {
        originalLength: compressed.originalLength,
        compressedLength: compressed.compressedLength,
        ratio: compressed.ratio
      }
    }
  };
}

