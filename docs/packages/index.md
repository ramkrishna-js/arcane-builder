# Packages

Use Arcane packages to keep complex feature domains out of your core runtime config.

## Available Package Docs

- `@arcane/moderation`: moderation actions and automod workflows
- `@arcane/music`: queue/player and voice workflows
- `@arcane/leveling`: XP progression and rank systems

## Package Config Pattern

```json
{
  "package": "@arcane/moderation",
  "version": "latest",
  "enabled": true,
  "config": {}
}
```

## Usage Flow

1. Add a package config file in `packages/`.
2. Reference the package from command/event JSON.
3. Run `arcane validate --strict`.
4. Run `arcane dev` and verify behavior.
