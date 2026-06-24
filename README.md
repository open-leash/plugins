<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:14B8A6,45:A855F7,100:F97316&height=220&section=header&text=OpenLeash%20Plugins&fontSize=56&fontColor=ffffff&fontAlignY=38&desc=Composable%20features%20for%20the%20OpenLeash%20agent%20pipeline.&descSize=18&descAlignY=58" width="100%" />

<p>
  <a href="https://openleash.com"><img src="https://img.shields.io/badge/OpenLeash-openleash.com-14B8A6?style=for-the-badge&logo=googlechrome&logoColor=white" /></a>
  <a href="https://docs.openleash.com/reference/plugins"><img src="https://img.shields.io/badge/Docs-plugin%20reference-A855F7?style=for-the-badge&logo=readthedocs&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/Contract-events%20%2B%20capabilities-F97316?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

<h3>Add focused features to the OpenLeash agent pipeline with clear events, settings, and capabilities.</h3>

<img src="./assets/openleash-plugin-pipeline.png" alt="OpenLeash plugin pipeline" width="860" />

</div>

---

## What Is A Plugin?

A plugin is a small feature that runs when something happens in an agent session.

An agent does something. OpenLeash intercepts it, normalizes it into an event, finds the plugins subscribed to that event, runs them in order, and returns a result when the agent needs one.

```text
agent action
  -> OpenLeash intercepts
  -> OpenLeash emits an event
  -> matching plugins run in order
  -> OpenLeash returns allow, deny, ask, transformed prompt, inventory, or audit context
```

That means plugins can do more than security. They can transform prompts, reduce token cost, scan skills, inventory MCP tools, create audit context, ask for approval, or attach useful metadata to the session.

Plugins are contained. They do not import OpenLeash database modules, evaluators, server handlers, or model-key readers. They declare what they need in a manifest and receive stable runtime capabilities from OpenLeash.

---

## Real Examples

```text
User submits a long prompt
  -> event: prompt.beforeSubmit
  -> prompt-compression shortens it
  -> dlp checks the final prompt
  -> security-evaluator decides if it can continue
```

```text
Agent calls an MCP tool
  -> event: tool.beforeUse
  -> security-evaluator checks policy
  -> mcp-scanner records tool inventory and audit context
```

```text
OpenLeash sees a new agent skill
  -> event: skill.changed
  -> skill-scanner reviews the skill for suspicious instructions
  -> OpenLeash stores the finding or asks for review
```

---

## Repository Map

```text
plugins/
  prompt-compression/
  dlp/
  security-evaluator/
  mcp-scanner/
  skill-scanner/

examples/
  basic-observer/
  prompt-evaluator/

docs/
  plugin-contract.md
  storage.md
```

---

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
- subscribed events
- permissions
- effects
- ordering
- settings schema
- default settings

---

## Minimal Manifest

```ts
export const manifest = {
  id: "acme.prompt-labeler",
  name: "Prompt Labeler",
  version: "1.0.0",
  publisher: "acme",
  runtime: "node",
  entrypoint: "src/index.ts",
  events: ["prompt.beforeSubmit"],
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

---

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

---

## Events

Use the narrowest event possible:

- `openleash.startup`
- `agent.detected`
- `skill.changed`
- `log.emitted`
- `prompt.beforeSubmit`
- `agent.response`
- `tool.beforeUse`
- `tool.afterUse`
- `session.started`
- `session.ended`

---

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
- `log:write`
- `notification:send`

---

## Runtime Capabilities

Capabilities are the stable boundary between plugins and OpenLeash internals.

```ts
await capabilities.prompt.compress({ prompt, level: "standard" });
await capabilities.dlp.inspect({ prompt, action: "mask", categories: ["pii", "keys"] });
await capabilities.security.evaluatePolicies({ request, policies });
await capabilities.notification.send({ title: "Review needed", body: "Risky command held." });
await capabilities.storage.set({ key: "cache/hash", value: { ok: true } });
await capabilities.log.emit({ level: "security", message: "Custom evaluator flagged a risky action." });
```

If a plugin needs a new privileged operation, add a narrow capability to the OpenLeash plugin contract. Do not import an internal OpenLeash module as a shortcut.

Plugins can request side effects, but OpenLeash owns final delivery. Notification requests can be suppressed, deduped, silenced, or routed by core policy. Plugin logs are stored as structured `log.emitted` events and can be exported by SIEM Exporter without giving plugins direct database or network access.

---

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

---

## First-Party Plugins

These plugins ship preinstalled in OpenLeash and can be used as reference implementations:

- [`plugins/prompt-compression`](plugins/prompt-compression)
- [`plugins/dlp`](plugins/dlp)
- [`plugins/security-evaluator`](plugins/security-evaluator)
- [`plugins/mcp-scanner`](plugins/mcp-scanner)
- [`plugins/skill-scanner`](plugins/skill-scanner)

## Examples

- [`examples/basic-observer`](examples/basic-observer) shows a tiny read-only plugin.
- [`examples/prompt-evaluator`](examples/prompt-evaluator) shows storage, notification, and typed findings.

<div align="center">

### Small plugins. Clear events. No spooky internal imports.

</div>
