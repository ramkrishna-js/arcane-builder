# Configuration Guide

`arcane.config.js` controls runtime identity, command registration scope, and project directory mapping.

## Practical Defaults

```js
module.exports = {
  name: 'arcanebuilder',
  version: '1.0.0',
  description: 'A Discord bot built with Arcane Builder',
  bot: {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    prefix: '!',
    intents: ['Guilds', 'GuildMessages', 'MessageContent']
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
    logLevel: 'info'
  }
};
```

## High-Impact Settings

- `bot.intents`: controls event visibility
- `bot.prefix`: text command prefix
- `settings.devGuild`: slash command registration scope for fast iteration
- `directories.*`: where Arcane loads resources

## Registration Strategy

Development:

- set `settings.devGuild` for near-instant slash updates

Production:

- remove `settings.devGuild` for global registration

## Validation Flow

```bash
arcane validate --strict
```
