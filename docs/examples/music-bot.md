# Example: Music Bot

## Setup

```bash
arcane init music-bot
cd music-bot
arcane package add @arcane/music
arcane create command music/play
arcane create command music/skip
arcane create command music/queue
```

## Recommended Config

- Enable voice intents
- Set music package queue and leave behavior
- Restrict music commands to one channel if needed
