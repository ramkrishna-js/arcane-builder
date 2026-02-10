# Events Guide

Arcane events are JSON files in `events/` and map to Discord event names.

## Minimal Schema

- `event` (required, e.g. `ready`, `guildMemberAdd`)
- `enabled` (boolean)
- `package` (`null` or package name)
- `config` (event-specific settings)

## Example

```json
{
  "event": "guildMemberAdd",
  "enabled": true,
  "package": "@arcane/welcome",
  "config": {
    "channels": {
      "welcome": "1234567890"
    }
  }
}
```

## Best Practices

- Keep event names aligned with Discord.js naming.
- Disable events you are not using (`"enabled": false`).
- Prefer package-based event handling for complex workflows.
- Add channel and role IDs as strings.
