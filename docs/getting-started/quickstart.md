# Quickstart

This quickstart takes a new bot from zero to running quickly.

## 1. Create a Bot Project

```bash
arcane init my-arcane-bot
cd my-arcane-bot
```

You can run non-interactive if needed:

```bash
arcane init my-arcane-bot --yes
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```dotenv
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
NODE_ENV=development
```

## 3. Validate the Project

```bash
arcane validate --strict
```

## 4. Start Development Mode

```bash
arcane dev
```

## 5. Add a New Command

```bash
arcane create command general/hello
```

Edit `commands/general/hello.json` to customize response.

## 6. Test in Discord

- Invite the bot with both scopes: `bot` and `applications.commands`
- Trigger text command (for `type: both`): `!hello`
- Trigger slash command: `/hello`
- If global slash command is not visible instantly, wait for propagation

## 7. Optional Deploy with PM2

```bash
arcane deploy --pm2 --name arcanebuilder
```
