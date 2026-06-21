export const manifest = {
  id: "example.prompt-evaluator",
  name: "Prompt Evaluator",
  description: "Flags risky prompts and dedupes notifications per session.",
  version: "1.0.0",
  publisher: "openleash",
  runtime: "node",
  entrypoint: "src/index.ts",
  events: ["prompt.beforeSubmit"],
  permissions: ["event:read", "prompt:read", "decision:write", "model:invoke", "storage:read", "storage:write", "notification:send", "audit:write"],
  effects: ["observe", "ask", "deny"],
  ordering: {
    priority: 300,
    after: ["openleash.dlp"]
  },
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      enabled: { type: "boolean" },
      riskThreshold: { type: "number", minimum: 0, maximum: 100 }
    }
  },
  defaultConfig: {
    enabled: true,
    riskThreshold: 70
  },
  tags: ["example", "security", "prompt"]
};

