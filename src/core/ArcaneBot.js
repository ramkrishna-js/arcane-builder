const path = require('path');
const dotenv = require('dotenv');
const ConfigLoader = require('./ConfigLoader');
const CommandHandler = require('./CommandHandler');
const EventHandler = require('./EventHandler');
const HotReload = require('./HotReload');
const PackageManager = require('../packages/PackageManager');
const Validator = require('../utils/validator').Validator;
const { createLogger } = require('../utils/logger');

class ArcaneBot {
  constructor({ mode = 'start' } = {}) {
    this.mode = mode;
    this.configLoader = new ConfigLoader();
    this.validator = new Validator();
    this.logger = createLogger('ArcaneBot');
    this.commandHandler = new CommandHandler({ validator: this.validator });
    this.eventHandler = new EventHandler({ validator: this.validator });
    this.packageManager = new PackageManager();
    this.hotReload = null;
    this.config = null;
  }

  async start() {
    dotenv.config();
    this.config = await this.configLoader.load('arcane.config.js');

    const commandsPath = path.resolve(process.cwd(), this.config.directories.commands);
    const eventsPath = path.resolve(process.cwd(), this.config.directories.events);
    const packagesPath = path.resolve(process.cwd(), this.config.directories.packages);

    await this.packageManager.loadConfiguredPackages(packagesPath);
    await this.commandHandler.loadCommands(commandsPath);
    await this.eventHandler.loadEvents(eventsPath);

    this.logger.info(`Mode: ${this.mode}`);
    this.logger.info(`Loaded ${this.commandHandler.commands.size} commands`);
    this.logger.info(`Loaded ${this.eventHandler.events.size} events`);
    this.logger.info(`Loaded ${this.packageManager.size()} packages`);
  }

  async enableHotReload() {
    if (!this.config) {
      throw new Error('Bot must be started before enabling hot reload.');
    }

    const directories = Object.values(this.config.directories)
      .map((dir) => path.resolve(process.cwd(), dir));

    this.hotReload = new HotReload({
      onReload: async ({ event, filePath }) => {
        this.logger.info(`Hot reload triggered (${event}): ${filePath}`);
        if (filePath.endsWith('.json') || filePath.endsWith('.js')) {
          await this.start();
        }
      }
    });

    this.hotReload.start(directories);
  }
}

module.exports = ArcaneBot;
