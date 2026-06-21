# OpenLeash Plugin: DLP

First-party OpenLeash plugin for masking or blocking sensitive prompt data.

This plugin ships preinstalled with OpenLeash. It is a reference for plugins that transform or deny prompts through stable capabilities.

## Behavior

- Event: `prompt.beforeSubmit`
- Runs after `openleash.prompt-compression`
- Inspects the final prompt
- Masks or blocks configured sensitive data categories

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `prompt:read`, `prompt:write`, `decision:write`, `model:invoke`, `audit:write`
- Effects: `transform`, `deny`, `observe`
- Settings: `enabled`, `action`, `categories`, `model`

## Plugin Builder Note

Use:

```ts
await capabilities.dlp.inspect({
  prompt,
  action: "mask",
  categories: ["pii", "keys", "credentials"]
});
```

Do not import OpenLeash DLP internals directly.
