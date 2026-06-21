import { manifest } from "./manifest.js";

export { manifest };

export async function run(input: any) {
  const startedAt = Date.now();
  const config = input.config ?? manifest.defaultConfig;

  if (!config.enabled) {
    return {
      status: "skipped",
      summary: "MCP Scanner is disabled.",
      startedAt
    };
  }

  const call = input.toolCall ?? input.event?.toolCall;

  if (!call) {
    return {
      status: "skipped",
      summary: "No MCP tool call was found in this event.",
      startedAt
    };
  }

  return {
    status: "passed",
    summary: `Observed MCP tool ${call.fullToolName ?? call.name ?? "unknown"}.`,
    startedAt,
    findings: [{
      title: "MCP tool call observed",
      severity: "info",
      summary: call.argumentSummary ?? call.fullToolName ?? call.name ?? "unknown",
      evidence: [call.fullToolName ?? call.name ?? "unknown"]
    }],
    metadata: {
      serverName: call.serverName,
      toolName: call.toolName ?? call.name
    }
  };
}

