# Commands Guide

Arcane commands are JSON files under `commands/` (nested folders supported).

## Minimal Schema

- `name` (required, lowercase slug)
- `description` (required, max 100 chars)
- `type` (`slash` | `text` | `both`)
- `package` (`null` for native/simple command)

## Example

```json
{
  "name": "hello",
  "description": "Say hello",
  "category": "general",
  "type": "both",
  "package": null,
  "cooldown": 3,
  "response": {
    "type": "embed",
    "title": "Hello",
    "description": "Hi {{user.mention}}"
  }
}
```

## Best Practices

- Keep one command per file.
- Group by domain (`commands/music/`, `commands/moderation/`).
- Use `cooldown` to prevent spam.
- Keep descriptions precise and short for slash command UX.
- Validate after edits: `arcane validate`.

## Package-backed Commands

Set `package` to route execution to installed package logic:

```json
{
  "name": "play",
  "description": "Play a track",
  "type": "slash",
  "package": "@arcane/music"
}
```
