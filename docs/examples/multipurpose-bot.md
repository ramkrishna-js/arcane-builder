# Example: Multipurpose Bot

## Setup

```bash
arcane init multipurpose-bot
cd multipurpose-bot
arcane package add @arcane/music
arcane package add @arcane/moderation
arcane package add @arcane/leveling
```

## Structure

- `commands/general/*` for utility commands
- `commands/music/*` for audio
- `commands/moderation/*` for server ops
- `events/*` for lifecycle and member flow
