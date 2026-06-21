# OpenLeash Plugin: Prompt Compression

First-party OpenLeash plugin for reducing prompt size before submission.

This plugin ships preinstalled with OpenLeash. The repo is also a reference for builders who want to write prompt-transform plugins without importing OpenLeash internals.

## Behavior

- Event: `prompt.beforeSubmit`
- Runs before `openleash.dlp`
- Reads the prompt
- Optionally calls the model-backed prompt compression capability
- Returns the transformed prompt and compression metadata

```text
prompt.beforeSubmit:
openleash.prompt-compression -> openleash.dlp -> openleash.security-evaluator
```

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `prompt:read`, `prompt:write`, `model:invoke`, `audit:write`
- Effects: `transform`, `observe`
- Settings: `enabled`, `level`, `conciseResponse`, `model`

## Plugin Builder Note

Do not import OpenLeash prompt-transform internals. Use:

```ts
await capabilities.prompt.compress({
  prompt,
  level: config.level,
  conciseResponse: config.conciseResponse,
  model: config.model
});
```

OpenLeash decides how that capability is backed in OpenLeash Cloud or Private Cloud.
