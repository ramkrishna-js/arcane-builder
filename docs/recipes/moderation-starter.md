# Recipe: Moderation Starter

## Goal

Start a moderation baseline with clear command grouping.

## Setup

```bash
arcane package add @arcane/moderation
arcane create command moderation/warn
arcane create command moderation/ban
```

## Structure

- `commands/moderation/*`
- `events/*` for join/leave and logging hooks
- `packages/moderation.json` for thresholds and behavior

## Validation Gate

```bash
arcane validate --strict
```
