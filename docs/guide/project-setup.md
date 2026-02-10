# Project Setup

## Initialize

```bash
arcane init my-bot
cd my-bot
```

The init flow supports guided prompts and optional non-interactive mode.

## Configure Env

```bash
cp .env.example .env
```

Set at least:

```dotenv
DISCORD_TOKEN=
CLIENT_ID=
NODE_ENV=development
```

## Validate

```bash
arcane validate --strict
```

## Run

```bash
arcane dev
```
