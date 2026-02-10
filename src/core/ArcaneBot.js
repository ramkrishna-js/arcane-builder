const path = require('path');
const dotenv = require('dotenv');
const {
  Client,
  GatewayIntentBits,
  Partials,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require('discord.js');
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
    this.client = null;
    this.loggedIn = false;
    this.handlersBound = false;
  }

  resolveIntents(intentNames = []) {
    const resolved = [];
    for (const name of intentNames) {
      if (GatewayIntentBits[name] !== undefined) {
        resolved.push(GatewayIntentBits[name]);
      } else {
        this.logger.warn(`Unknown intent "${name}" skipped.`);
      }
    }
    return resolved.length ? resolved : [GatewayIntentBits.Guilds];
  }

  resolvePartials(partialNames = []) {
    const resolved = [];
    for (const name of partialNames) {
      if (Partials[name] !== undefined) {
        resolved.push(Partials[name]);
      } else {
        this.logger.warn(`Unknown partial "${name}" skipped.`);
      }
    }
    return resolved;
  }

  async loadProjectState() {
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

  async start() {
    dotenv.config();
    await this.loadProjectState();

    if (!this.client) {
      const intents = this.resolveIntents(this.config.bot.intents || []);
      const partials = this.resolvePartials(this.config.bot.partials || []);

      this.client = new Client({ intents, partials });
      this.client.once('ready', () => {
        this.logger.info(`Discord connected as ${this.client.user.tag}`);
      });
    }

    if (!this.loggedIn) {
      const token = this.config.bot.token || process.env.DISCORD_TOKEN;
      if (!token) {
        throw new Error('Missing bot token. Set DISCORD_TOKEN in .env.');
      }
      await this.client.login(token);
      this.loggedIn = true;
      await this.waitForReady();
      await this.registerCommands();
      this.bindRuntimeHandlers();
    }
  }

  async waitForReady() {
    if (this.client.isReady()) {
      return;
    }
    await new Promise((resolve) => this.client.once('ready', resolve));
  }

  mapOptionType(type) {
    const normalized = String(type || '').toLowerCase();
    switch (normalized) {
      case 'string':
        return ApplicationCommandOptionType.String;
      case 'number':
        return ApplicationCommandOptionType.Number;
      case 'integer':
        return ApplicationCommandOptionType.Integer;
      case 'boolean':
        return ApplicationCommandOptionType.Boolean;
      case 'user':
        return ApplicationCommandOptionType.User;
      case 'channel':
        return ApplicationCommandOptionType.Channel;
      case 'role':
        return ApplicationCommandOptionType.Role;
      case 'mentionable':
        return ApplicationCommandOptionType.Mentionable;
      case 'attachment':
        return ApplicationCommandOptionType.Attachment;
      default:
        return ApplicationCommandOptionType.String;
    }
  }

  toSlashCommandData(command) {
    return {
      name: command.name,
      description: command.description || `Command ${command.name}`,
      options: (command.options || []).map((opt) => ({
        name: opt.name,
        description: opt.description || opt.name,
        type: this.mapOptionType(opt.type),
        required: Boolean(opt.required),
        autocomplete: Boolean(opt.autocomplete),
        min_value: opt.min,
        max_value: opt.max
      }))
    };
  }

  async registerCommands() {
    const allCommands = [...this.commandHandler.commands.values()].map((entry) => entry.config);
    const slashCommands = allCommands
      .filter((cmd) => cmd.type === 'slash' || cmd.type === 'both')
      .map((cmd) => this.toSlashCommandData(cmd));

    const devGuild = this.config?.settings?.devGuild;
    if (devGuild) {
      const guild = await this.client.guilds.fetch(devGuild);
      await guild.commands.set(slashCommands);
      this.logger.info(`Registered ${slashCommands.length} slash commands in dev guild ${devGuild}`);
      return;
    }

    await this.client.application.commands.set(slashCommands);
    this.logger.info(`Registered ${slashCommands.length} global slash commands`);
  }

  createResponsePayload(commandConfig) {
    const response = commandConfig.response || commandConfig.responses?.success;
    if (!response) {
      return { content: `Executed: ${commandConfig.name}` };
    }

    if (response.type === 'embed') {
      const embed = new EmbedBuilder();
      if (response.title) embed.setTitle(response.title);
      if (response.description) embed.setDescription(response.description);
      if (response.color) embed.setColor(response.color);
      if (response.fields && Array.isArray(response.fields)) {
        embed.setFields(
          response.fields.map((f) => ({
            name: f.name || 'Field',
            value: f.value || '-',
            inline: Boolean(f.inline)
          }))
        );
      }
      return { embeds: [embed] };
    }

    return { content: response.content || `Executed: ${commandConfig.name}` };
  }

  bindRuntimeHandlers() {
    if (this.handlersBound) {
      return;
    }

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      try {
        const registered = this.commandHandler.commands.get(interaction.commandName);
        if (!registered) return;
        const commandConfig = registered.config;
        const result = await this.commandHandler.handleCommand(interaction, this.packageManager);
        const payload = result?.response || this.createResponsePayload(commandConfig);
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(payload);
        } else {
          await interaction.reply(payload);
        }
      } catch (error) {
        this.logger.error(`Interaction failed: ${error.message}`);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ content: '❌ Command failed.', ephemeral: true });
        }
      }
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      const prefix = this.config?.bot?.prefix || '!';
      if (!message.content.startsWith(prefix)) return;
      const commandName = message.content.slice(prefix.length).trim().split(/\s+/)[0]?.toLowerCase();
      if (!commandName) return;

      const registered = this.commandHandler.commands.get(commandName);
      if (!registered) return;
      const cfg = registered.config;
      if (!(cfg.type === 'text' || cfg.type === 'both')) return;
      if (cfg.package) return;

      const payload = this.createResponsePayload(cfg);
      if (payload.embeds) {
        await message.reply({ embeds: payload.embeds });
      } else {
        await message.reply(payload.content || 'Done.');
      }
    });

    this.handlersBound = true;
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
          await this.loadProjectState();
          if (this.loggedIn && this.client?.isReady()) {
            await this.registerCommands();
          }
        }
      }
    });

    this.hotReload.start(directories);
  }
}

module.exports = ArcaneBot;
