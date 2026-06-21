# Plugin Storage

Plugins should not install their own database for normal state. Use OpenLeash plugin storage so data works the same in OpenLeash Cloud and Private Cloud.

Storage is a scoped JSON document store:

```text
organization_id + plugin_id + scope + key -> value
```

The runtime injects `organization_id` and `plugin_id`. Plugin code can only choose `scope` and `key`.

## Operations

```ts
await capabilities.storage.get({ scope, key });
await capabilities.storage.set({ scope, key, value, ttlSeconds });
await capabilities.storage.list({ scope, keyPrefix, limit });
await capabilities.storage.delete({ scope, key });
```

## When To Use It

- notification dedupe
- session summaries
- cache entries
- lightweight heuristics
- inventory snapshots
- plugin-owned preferences

## When Not To Use It

Do not use plugin storage for large analytics tables, cross-plugin joins, raw SQL, or product authority. If a plugin needs indexed analytics or a new privileged data view, propose a new reviewed capability.

