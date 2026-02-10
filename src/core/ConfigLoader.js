const path = require('path');
const fs = require('fs-extra');

const defaults = {
  name: 'arcanebuilder',
  version: '1.0.0',
  bot: {
    token: process.env.DISCORD_TOKEN,
    intents: ['Guilds'],
    prefix: '!'
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

class ConfigLoader {
  async load(configPath = 'arcane.config.js') {
    const absolutePath = path.resolve(process.cwd(), configPath);

    if (!(await fs.pathExists(absolutePath))) {
      throw new Error(`Config file not found: ${absolutePath}`);
    }

    delete require.cache[require.resolve(absolutePath)];
    const loaded = require(absolutePath);

    return this.mergeDefaults(loaded);
  }

  mergeDefaults(config) {
    return {
      ...defaults,
      ...config,
      bot: {
        ...defaults.bot,
        ...(config.bot || {})
      },
      directories: {
        ...defaults.directories,
        ...(config.directories || {})
      },
      settings: {
        ...defaults.settings,
        ...(config.settings || {}),
        commandDefaults: {
          ...defaults.settings.commandDefaults,
          ...((config.settings && config.settings.commandDefaults) || {})
        }
      }
    };
  }
}

module.exports = ConfigLoader;
