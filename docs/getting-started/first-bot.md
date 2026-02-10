# First Bot Walkthrough

This guide builds a basic multipurpose bot with command, event, and package config.

## Step 1: Initialize

```bash
arcane init first-bot
cd first-bot
```

## Step 2: Core Config

Edit `arcane.config.js` and confirm:

- `bot.token` uses `process.env.DISCORD_TOKEN`
- `bot.intents` includes the events you need
- `directories` point to your folder layout

## Step 3: Command

Create and edit:

```bash
arcane create command general/ping
```

Example payload:

```json
{
  "name": "ping",
  "description": "Latency check",
  "type": "both",
  "package": null,
  "cooldown": 2,
  "response": {
    "type": "message",
    "content": "Pong from Arcane"
  }
}
```

## Step 4: Event

```bash
arcane create event ready
```

Set `event` to `ready` and add startup console messaging.

## Step 5: Optional Package

```bash
arcane package add @arcane/music
```

Then tune `packages/` JSON config.

## Step 6: Run

```bash
arcane validate --strict
arcane dev
```

You now have a clean, file-first bot workflow.
