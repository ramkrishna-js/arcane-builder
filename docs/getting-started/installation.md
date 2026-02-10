# Installation

## Requirements

- Node.js 18+
- npm 9+
- A Discord application and bot token

## Global Install

```bash
npm install -g arcane-builder
```

## Local Development (Framework Contributors)

```bash
git clone <your-fork-or-repo>
cd arcane-builder
npm install
npm link
```

Now `arcane` is available globally from your local checkout.

## Verify Install

```bash
arcane --version
arcane --help
```

## Create Your First Project

```bash
arcane init my-bot
cd my-bot
cp .env.example .env
# set DISCORD_TOKEN in .env
arcane dev
```
