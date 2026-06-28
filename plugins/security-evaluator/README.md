# OpenLeash Plugin: rules-enforcer

First-party OpenLeash plugin for evaluating prompts, agent responses, and tool actions against configured enforceable rules.

This plugin ships preinstalled with OpenLeash. It is the reference for plugins that return allow, deny, or ask decisions through the pipeline.

## Behavior

- Events: `prompt.beforeSubmit`, `agent.response`, `tool.beforeUse`, `tool.afterUse`
- Runs after `openleash.dlp` for prompts
- Uses policy evaluation capabilities
- Each rule has an action: `ask` creates an approval; `block` denies immediately
- Can send notifications through OpenLeash-owned notification delivery

The plugin does not directly create desktop popups. It returns a typed result and uses OpenLeash capabilities when it wants notification-shaped behavior. OpenLeash core owns desktop, mobile, web, dashboard, audit, and native hook response delivery.

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `prompt:read`, `tool:read`, `decision:write`, `model:invoke`, `audit:write`, `log:write`, `notification:send`
- Effects: `observe`, `ask`, `deny`
- Settings: `enabled`, `rules[]` where each rule has `text` and `action` (`ask` by default, or `block`)

## Plugin Builder Note

Policy-aware plugins should return findings and status. Avoid writing directly to approval or audit tables.
