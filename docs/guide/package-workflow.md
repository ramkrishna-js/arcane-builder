# Package Workflow

## Add Package Config

```bash
arcane package add @arcane/music
```

## Tune Package JSON

Edit `packages/*.json` to define package behavior.

## Package-backed Commands

Set command `package` to route execution to loaded package logic.

```json
{
  "name": "play",
  "description": "Play track",
  "type": "slash",
  "package": "@arcane/music"
}
```

## Validate

```bash
arcane validate --strict
```
