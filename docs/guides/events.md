# Events Guide

Arcane events are JSON files in `events/` and map to Discord event names.

## Minimal Schema

- `event` (required, e.g. `ready`, `guildMemberAdd`)
- `enabled` (boolean)
- `once` (boolean, optional)
- `package` (`null` or package name)
- `config` (event-specific settings)
- `response` (optional response payload for core event handling)

## Example

```json
{
  "event": "ready",
  "enabled": true,
  "once": true,
  "package": null,
  "config": {
    "console": {
      "message": "{{bot.tag}} online and listening"
    }
  },
  "response": {
    "type": "message",
    "content": "Bot started at {{guild.name}}"
  }
}
```

## Core Runtime Behavior

- If `package` is set and loaded, Arcane calls `executeEvent(eventConfig, args, context)`.
- If no package is set, Arcane can:
  - log `config.console.message`
  - send `response` to `config.channelId` (if provided) or inferred event channel
- `once: true` binds with `client.once(...)`; otherwise Arcane binds a persistent listener.

## Best Practices

- Keep event names aligned with Discord.js naming.
- Disable events you are not using (`"enabled": false`).
- Prefer package-based event handling for complex workflows.
- Add channel IDs as strings when using `config.channelId`.
