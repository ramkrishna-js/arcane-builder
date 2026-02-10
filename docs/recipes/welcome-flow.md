# Recipe: Welcome Flow

## Goal

Send structured welcome messages when members join.

## Steps

1. Create event JSON in `events/memberJoin.json`.
2. Use package-backed flow (e.g., welcome package) or custom event config.
3. Validate and test in a non-production guild.

## Skeleton

```json
{
  "event": "guildMemberAdd",
  "enabled": true,
  "package": "@arcane/welcome",
  "config": {
    "channels": { "welcome": "1234567890" },
    "message": {
      "type": "embed",
      "title": "Welcome {{member.mention}}",
      "description": "Welcome to {{guild.name}}"
    }
  }
}
```
