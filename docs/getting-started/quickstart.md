# Quickstart

This quickstart takes a new bot from zero to running in under 5 minutes.

## 1. Create a Bot Project

```bash
arcane init my-arcane-bot
cd my-arcane-bot
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
arcane validate
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

- Invite the bot to your server
- Trigger your command
- Edit JSON files and watch changes hot-reload
