export const manifest = {
  id: "example.basic-observer",
  name: "Basic Observer",
  description: "Records prompt length as a minimal plugin example.",
  version: "1.0.0",
  publisher: "openleash",
  runtime: "node",
  entrypoint: "src/index.ts",
  events: ["prompt.beforeSubmit"],
  permissions: ["event:read", "prompt:read", "storage:write", "audit:write"],
  effects: ["observe"],
  ordering: {
    priority: 900
  },
  defaultConfig: {
    enabled: true
  },
  tags: ["example", "prompt"]
};

