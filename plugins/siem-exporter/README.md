# OpenLeash Plugin: SIEM Exporter

OpenLeash plugin for forwarding organization security events to SOC and SIEM systems.

The plugin is configured once by an organization admin or CISO in the dashboard. OpenLeash backend services send the events after policy evaluation, using authenticated organization, user, host, agent, policy, decision, and plugin-run context.

## Behavior

- Supports ECS-shaped JSON for generic collectors
- Supports Splunk HEC-compatible JSON payloads
- Supports generic HTTPS webhook collectors
- Keeps prompt and tool argument forwarding disabled by default
- Exports OpenLeash system logs and plugin-emitted logs as `log.emitted` events

## Manifest

See [`src/manifest.ts`](src/manifest.ts).

Key points:

- Permissions: `event:read`, `prompt:read`, `tool:read`, `network:access`, `audit:write`, `log:write`
- Log sources: `openleash.core` system records and plugin records emitted through `capabilities.log.emit`
- Effects: `observe`, `notify`
- Settings: `protocol`, `endpointUrl`, `bearerToken`, `hecToken`, `source`, `sourcetype`, `index`, `minSeverity`, `includePrompt`, `includeToolArguments`
