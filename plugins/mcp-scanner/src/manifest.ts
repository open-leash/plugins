export const manifest = {
  id: "openleash.mcp-scanner",
  name: "MCP Scanner",
  description: "Discovers and inventories MCP tool calls for audit and risk review.",
  version: "1.0.0",
  publisher: "openleash",
  runtime: "node",
  entrypoint: "src/index.ts",
  events: ["tool.beforeUse", "tool.afterUse"],
  permissions: ["event:read", "tool:read", "audit:write"],
  effects: ["observe", "inventory"],
  ordering: {
    priority: 400,
    after: ["openleash.security-evaluator"]
  },
  defaultConfig: {
    enabled: true,
    redactSecrets: true
  },
  tags: ["mcp", "inventory", "audit"]
};

