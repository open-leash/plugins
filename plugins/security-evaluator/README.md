# OpenLeash Plugin: Security Evaluator

First-party OpenLeash plugin for evaluating prompts, agent responses, and tool actions against active policy.

This plugin ships preinstalled with OpenLeash. It is the reference for plugins that return allow, deny, or ask decisions through the pipeline.

## Behavior

- Events: `prompt.beforeSubmit`, `agent.response`, `tool.beforeUse`, `tool.afterUse`
- Runs after `openleash.dlp` for prompts
- Uses policy evaluation capabilities
- Can request human review
- Can send notifications through OpenLeash-owned notification delivery

The plugin does not directly create desktop popups. It returns a typed result and uses `capabilities.notification` when it wants a notification. OpenLeash core owns desktop, mobile, dashboard, audit, and native hook response delivery.

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `prompt:read`, `tool:read`, `decision:write`, `model:invoke`, `audit:write`, `notification:send`
- Effects: `observe`, `ask`, `deny`
- Settings: `enabled`, `policySet`

## Plugin Builder Note

Policy-aware plugins should return findings and status. Avoid writing directly to approval or audit tables.

