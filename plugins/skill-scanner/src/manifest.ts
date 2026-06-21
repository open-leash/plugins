export const manifest = {
  id: "openleash.skill-scanner",
  name: "Skill Scanner",
  description: "Scans agent skills for suspicious instructions and records skill inventory.",
  version: "1.0.0",
  publisher: "openleash",
  runtime: "node",
  entrypoint: "src/index.ts",
  events: ["openleash.startup", "agent.detected", "skill.changed"],
  permissions: ["event:read", "filesystem:read", "decision:write", "model:invoke", "audit:write", "notification:send"],
  effects: ["observe", "ask", "inventory"],
  ordering: {
    priority: 150
  },
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      enabled: { type: "boolean" },
      suspiciousRiskThreshold: { type: "number", minimum: 0, maximum: 100 }
    }
  },
  defaultConfig: {
    enabled: true,
    suspiciousRiskThreshold: 50
  },
  tags: ["skills", "security", "inventory"]
};

