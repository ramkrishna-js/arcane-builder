# Configuration Guide

`arcane.config.js` is the project root config contract.

## Core Sections

- `name`, `version`, `description`
- `bot` token/client/prefix/intents/presence
- `directories` for commands/events/packages/data/assets/logs
- `registry` for package registry/CDN options
- `settings` for defaults, logging, feature flags
- `owners` and `permissions`

## Example

```javascript
module.exports = {
  name: 'MyBot',
  bot: {
    token: process.env.DISCORD_TOKEN,
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
  }
};
```

## Recommendations

- Keep env-dependent values in `.env`.
- Use explicit intent lists; do not over-request intents.
- Keep directory overrides rare and consistent.
- Re-run `arcane validate` after config changes.
