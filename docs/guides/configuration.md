# Configuration Guide

`arcane.config.js` is the root configuration contract for an Arcane project.

## Core Sections

- `name`, `version`, `description`
- `bot` token/client/prefix/intents/presence
- `directories` for commands/events/packages/data/assets/logs
- `registry` for package registry/CDN options
- `settings` for defaults, logging, feature flags
- `owners` and `permissions`

## Production-minded Example

```javascript
module.exports = {
  name: 'MyBot',
  version: '1.0.0',
  description: 'Arcane bot',
  bot: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    prefix: '!',
    intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent']
  },
  directories: {
    commands: './commands',
    events: './events',
    packages: './packages',
    data: './data',
    assets: './assets',
    logs: './logs'
  },
  settings: {
    logLevel: 'info',
    commandDefaults: {
      cooldown: 3,
      ephemeral: false
    }
  }
};
```

## Environment Strategy

Use `.env` for all secrets and deployment-specific values:

```dotenv
DISCORD_TOKEN=
CLIENT_ID=
NODE_ENV=development
```

## Config Hygiene Rules

- Keep directory paths explicit and stable.
- Avoid over-requesting intents; only include what features require.
- Keep default command behavior centralized in `settings.commandDefaults`.
- Validate after every structural config change.

## Validation Loop

```bash
arcane validate
arcane validate --strict
```
