# Plugin Contract

The OpenLeash plugin contract is intentionally small.

## Rule One

Plugins use capabilities, not OpenLeash internals.

Good:

```ts
await capabilities.storage.get({ scope, key: "last-risk" });
await capabilities.notification.send({ title, body });
```

Avoid:

```ts
import { db } from "@openleash/client-api/src/db";
import { evaluatePolicy } from "@openleash/client-api/src/evaluator";
```

Internal modules can change at any time. Capabilities are the compatibility promise.

## Host Context

Plugins are independent of the computer that happens to run an agent. They should not assume direct filesystem, shell, database, keychain, browser, or process access. OpenLeash discovers host context and exposes only reviewed, product-level context through capabilities.

Agent instruction files are exposed this way:

```ts
const files = await capabilities.context.instructions.list();
```

The returned files may include global and project instructions from Claude Code, Codex CLI, Cursor, Cline, OpenCode, Windsurf, and GitHub Copilot. Each file contains metadata plus raw content and, when OpenLeash has already parsed it, candidate lines:

```ts
{
  agent: "Codex CLI",
  scope: "project",
  label: "Project AGENTS.md",
  path: "/repo/AGENTS.md",
  content: "...",
  parsedLines: ["Run tests before release", "..."]
}
```

Some plugins can use `parsedLines`; others can parse `content` themselves. Both are valid. The invariant is that plugins receive instruction files from OpenLeash, not by walking the host filesystem.

## Manifest Fields

- `id`: globally unique plugin id, usually reverse-DNS or publisher-prefixed.
- `name`: human-readable name.
- `description`: short catalog description.
- `version`: semantic version.
- `publisher`: person, company, or organization publishing the plugin.
- `runtime`: execution runtime, for example `node` or `openleash-core`.
- `entrypoint`: plugin handler entrypoint.
- `events`: OpenLeash events the plugin subscribes to.
- `permissions`: requested capabilities and data access.
- `effects`: what the plugin can do: `observe`, `transform`, `deny`, `ask`, `inventory`.
- `ordering`: deterministic pipeline hints.
- `configSchema`: JSON-schema-like settings contract.
- `defaultConfig`: initial settings.
- `tags`: catalog search tags.

## Ordering

The runtime resolves `before` and `after` first. `priority` is the fallback.

```ts
ordering: {
  priority: 200,
  after: ["openleash.prompt-compression"],
  before: ["openleash.rules-enforcer"]
}
```

For prompts, OpenLeash currently runs:

```text
prompt-compression -> dlp -> rules-enforcer
```

Compression changes the prompt first, DLP checks the final prompt, and the evaluator decides whether policy allows it.

## Settings

Settings are generated from `configSchema`.

Solo users configure personal plugins in desktop settings. Organization users inherit admin-managed settings from the dashboard.
