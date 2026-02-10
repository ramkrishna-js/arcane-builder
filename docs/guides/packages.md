# Packages Guide

Packages extend Arcane features without local `node_modules` in the bot project.

## Package File

Each file in `packages/` defines one package config.

```json
{
  "package": "@arcane/music",
  "version": "latest",
  "enabled": true,
  "config": {
    "player": {
      "defaultVolume": 50
    }
  }
}
```

## CLI Flows

```bash
arcane package add @arcane/music
arcane package list
arcane package remove @arcane/music
```

## Version Strategy

- `latest` for fast iteration
- pin versions for production stability
- keep lock data under `.arcane/arcane.lock.json`

## Design Advice

- Separate command definitions from package internals.
- Keep package config focused on behavior, not secrets.
- Use `.env` for secrets and reference via config loader.
