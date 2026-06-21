# OpenLeash Plugin: Skill Scanner

First-party OpenLeash plugin for observing agent skills and flagging suspicious instructions.

This plugin ships preinstalled with OpenLeash. It is a reference for startup, agent inventory, and skill-change plugins.

## Behavior

- Events: `openleash.startup`, `agent.detected`, `skill.changed`
- Reads skill metadata and optional skill file content through approved runtime inputs/capabilities
- Returns suspicious findings when skill behavior crosses the configured threshold

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `filesystem:read`, `decision:write`, `model:invoke`, `audit:write`, `notification:send`
- Effects: `observe`, `ask`, `inventory`
- Settings: `enabled`, `suspiciousRiskThreshold`

## Plugin Builder Note

Skill scanners should read only the files OpenLeash passes or authorizes. If a scanner needs broader file access, request `filesystem:read` and explain why in the plugin README.

