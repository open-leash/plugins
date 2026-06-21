# OpenLeash Plugins

Examples, templates, and builder notes for OpenLeash pipeline plugins.

OpenLeash is an interception layer for AI agents. Agent-specific hooks are normalized into OpenLeash events, then the enabled plugins for that event run in a deterministic pipeline.

```text
agent hook -> desktop relay -> client-api -> event -> ordered plugin pipeline
```

Plugins are contained. They do not import OpenLeash database modules, evaluators, server handlers, or model-key readers. They declare what they need in a manifest and receive stable runtime capabilities from OpenLeash.

## What A Plugin Contains

```text
my-plugin/
  README.md
  package.json
  src/
    manifest.ts
    index.ts
```

The manifest is the plugin contract:

- metadata for store/catalog display
- subscribed stages
- permissions
- effects
- ordering
- settings schema
- default settings

## Minimal Manifest

```ts
export const manifest = {
  id: "acme.prompt-labeler",
  name: "Prompt Labeler",
  version: "1.0.0",
  publisher: "acme",
  runtime: "node",
  entrypoint: "src/index.ts",
  stages: ["prompt.beforeSubmit"],
  permissions: ["event:read", "prompt:read", "audit:write", "storage:write"],
  effects: ["observe"],
  ordering: {
    priority: 250,
    after: ["openleash.dlp"]
  },
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      enabled: { type: "boolean" },
      label: { type: "string" }
    }
  },
  defaultConfig: {
    enabled: true,
    label: "reviewed"
  }
};
```

## Minimal Handler

```ts
export async function run(input, capabilities) {
  if (!input.config.enabled) {
    return { status: "skipped", summary: "Disabled." };
  }

  await capabilities.storage.set({
    scope: { sessionId: input.event.sessionId },
    key: "labels/latest",
    value: { label: input.config.label, at: Date.now() },
    ttlSeconds: 86400
  });

  return {
    status: "passed",
    summary: "Prompt labeled.",
    findings: [{
      title: "Prompt label",
      severity: "info",
      summary: input.config.label
    }]
  };
}
```

## Stages

Use the narrowest stage possible:

- `openleash.startup`
- `agent.detected`
- `skill.changed`
- `prompt.beforeSubmit`
- `agent.response`
- `tool.beforeUse`
- `tool.afterUse`
- `session.started`
- `session.ended`

## Permissions

Declare only what the plugin needs:

- `event:read`
- `prompt:read`
- `prompt:write`
- `tool:read`
- `decision:write`
- `model:invoke`
- `filesystem:read`
- `filesystem:write`
- `storage:read`
- `storage:write`
- `audit:write`
- `notification:send`

## Runtime Capabilities

Capabilities are the stable boundary between plugins and OpenLeash internals.

Examples:

```ts
await capabilities.prompt.compress({ prompt, level: "standard" });
await capabilities.dlp.inspect({ prompt, action: "mask", categories: ["pii", "keys"] });
await capabilities.security.evaluatePolicies({ request, policies });
await capabilities.notification.send({ title: "Review needed", body: "Risky command held." });
await capabilities.storage.set({ key: "cache/hash", value: { ok: true } });
```

If a plugin needs a new privileged operation, add a narrow capability to the OpenLeash plugin contract. Do not import an internal OpenLeash module as a shortcut.

## Plugin Storage

Plugins use OpenLeash-owned, plugin-scoped JSON storage. OpenLeash injects the organization and plugin identity.

```text
organization_id + plugin_id + scope + key
```

The plugin supplies only `scope` and `key`, so one plugin cannot read another plugin's data.

Good key shapes:

- `sessions/<session-id>/summary`
- `heuristics/<user-id>/risk-profile`
- `cache/<hash>`
- `notifications/<dedupe-key>`

## First-Party Plugin Repos

These plugins ship preinstalled in OpenLeash and can be used as reference implementations:

- `open-leash/openleash-plugin-prompt-compression`
- `open-leash/openleash-plugin-dlp`
- `open-leash/openleash-plugin-security-evaluator`
- `open-leash/openleash-plugin-mcp-scanner`
- `open-leash/openleash-plugin-skill-scanner`

## Examples

- `examples/basic-observer` shows a tiny read-only plugin.
- `examples/prompt-evaluator` shows storage, notification, and typed findings.

