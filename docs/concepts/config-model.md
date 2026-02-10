# Config Model

`arcane.config.js` is the root contract between your project files and Arcane runtime.

## Required Practical Sections

- `bot`: token, prefix, intents, optional partials
- `directories`: where Arcane loads commands/events/packages/data
- `settings`: runtime defaults and dev/prod behavior

## Registration Scope

- `settings.devGuild` set: slash commands register to one guild (fast)
- `settings.devGuild` unset: slash commands register globally (slower propagation)

## Minimal Safe Example

```js
module.exports = {
  name: 'arcanebuilder',
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
  },
  settings: {
    logLevel: 'info'
  }
};
```
