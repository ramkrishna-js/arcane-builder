# @arcane/moderation

Moderation automation and action command support.

## Typical Features

- Warnings and escalation
- Kick/ban/mute actions
- Anti-spam filters
- Audit logging hooks

## Example Config

```json
{
  "package": "@arcane/moderation",
  "version": "latest",
  "enabled": true,
  "config": {
    "automod": {
      "antiSpam": true,
      "maxMentions": 5
    }
  }
}
```
