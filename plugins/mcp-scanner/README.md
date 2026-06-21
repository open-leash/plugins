# OpenLeash Plugin: MCP Scanner

First-party OpenLeash plugin for observing MCP tool calls and producing inventory/audit context.

This plugin ships preinstalled with OpenLeash. It is a reference for read-only tool-event plugins.

## Behavior

- Events: `tool.beforeUse`, `tool.afterUse`
- Runs after `openleash.security-evaluator`
- Reads normalized tool call context
- Returns inventory metadata and findings

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `tool:read`, `audit:write`
- Effects: `observe`, `inventory`
- Settings: `enabled`, `redactSecrets`

## Plugin Builder Note

MCP scanner plugins should treat tool arguments as sensitive. Return summaries and redacted metadata instead of storing raw secrets.

