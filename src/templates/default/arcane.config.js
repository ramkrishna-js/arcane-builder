module.exports = {
  name: 'MyArcaneBot',
  version: '1.0.0',
  description: 'A Discord bot built with Arcane',
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
    logLevel: 'info',
    commandDefaults: {
      cooldown: 3,
      ephemeral: false
    }
  }
};
