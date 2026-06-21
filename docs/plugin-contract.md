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

## Manifest Fields

- `id`: globally unique plugin id, usually reverse-DNS or publisher-prefixed.
- `name`: human-readable name.
- `description`: short catalog description.
- `version`: semantic version.
- `publisher`: person, company, or organization publishing the plugin.
- `runtime`: execution runtime, for example `node` or `openleash-core`.
- `entrypoint`: plugin handler entrypoint.
- `stages`: OpenLeash stages the plugin subscribes to.
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
  before: ["openleash.security-evaluator"]
}
```

For prompts, OpenLeash currently runs:

```text
prompt-compression -> dlp -> security-evaluator
```

Compression changes the prompt first, DLP checks the final prompt, and the evaluator decides whether policy allows it.

## Settings

Settings are generated from `configSchema`.

Solo users configure personal plugins in desktop settings. Organization users inherit admin-managed settings from the dashboard.

