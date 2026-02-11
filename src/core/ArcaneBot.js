const path = require('path');
const dotenv = require('dotenv');
const {
  Client,
  GatewayIntentBits,
  Partials,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder
} = require('discord.js');
const ConfigLoader = require('./ConfigLoader');
const CommandHandler = require('./CommandHandler');
const EventHandler = require('./EventHandler');
const HotReload = require('./HotReload');
const PackageManager = require('../packages/PackageManager');
const Validator = require('../utils/validator').Validator;
const { createLogger } = require('../utils/logger');
const { renderTemplate } = require('../utils/templater');

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
    this.componentRegistry = new Map();
    this.boundEventListeners = [];
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
    this.componentRegistry.clear();
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
      this.bindConfiguredEvents();
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

  getTemplateContext(source, extras = {}) {
    const user = source?.user || source?.author;
    const member = source?.member;
    const guild = source?.guild;
    const channel = source?.channel;
    const botUser = this.client?.user;

    return {
      user: user ? {
        id: user.id,
        tag: user.tag,
        username: user.username,
        mention: `<@${user.id}>`,
        avatar: user.displayAvatarURL ? user.displayAvatarURL() : undefined
      } : {},
      member: member ? {
        id: member.id,
        nickname: member.nickname,
        mention: `<@${member.id}>`
      } : {},
      guild: guild ? {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount
      } : {},
      channel: channel ? {
        id: channel.id,
        name: channel.name,
        mention: `<#${channel.id}>`
      } : {},
      bot: botUser ? {
        id: botUser.id,
        tag: botUser.tag,
        avatar: botUser.displayAvatarURL ? botUser.displayAvatarURL() : undefined
      } : {},
      ...extras
    };
  }

  templateValue(value, context) {
    if (typeof value === 'string') {
      return renderTemplate(value, context);
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.templateValue(v, context));
    }
    if (value && typeof value === 'object') {
      const out = {};
      for (const [key, child] of Object.entries(value)) {
        out[key] = this.templateValue(child, context);
      }
      return out;
    }
    return value;
  }

  resolveButtonStyle(style) {
    const value = String(style || 'secondary').toLowerCase();
    switch (value) {
      case 'primary':
        return ButtonStyle.Primary;
      case 'secondary':
        return ButtonStyle.Secondary;
      case 'success':
        return ButtonStyle.Success;
      case 'danger':
        return ButtonStyle.Danger;
      case 'link':
        return ButtonStyle.Link;
      default:
        return ButtonStyle.Secondary;
    }
  }

  registerComponentAction(commandName, id, action, interactionScope = null) {
    this.componentRegistry.set(id, {
      commandName,
      action,
      interactionScope
    });
  }

  buildComponentRows(commandConfig, context, interactionScope = null) {
    const rows = [];
    const buttons = commandConfig.buttons || [];
    const selectMenus = commandConfig.selectMenus || commandConfig.dropdowns || [];

    if (buttons.length) {
      let row = new ActionRowBuilder();
      let countInRow = 0;
      buttons.forEach((btn, index) => {
        const templated = this.templateValue(btn, context);
        const style = this.resolveButtonStyle(templated.style);
        const component = new ButtonBuilder()
          .setLabel(templated.label || `Button ${index + 1}`)
          .setStyle(style)
          .setDisabled(Boolean(templated.disabled));

        if (templated.emoji) {
          component.setEmoji(templated.emoji);
        }

        if (style === ButtonStyle.Link) {
          if (!templated.url) return;
          component.setURL(templated.url);
        } else {
          const customId = templated.customId || `arcane:${commandConfig.name}:btn:${index}`;
          component.setCustomId(customId);
          this.registerComponentAction(commandConfig.name, customId, templated, interactionScope);
        }

        row.addComponents(component);
        countInRow += 1;

        if (countInRow >= 5) {
          rows.push(row);
          row = new ActionRowBuilder();
          countInRow = 0;
        }
      });
      if (countInRow > 0) rows.push(row);
    }

    for (let i = 0; i < selectMenus.length; i += 1) {
      const menu = this.templateValue(selectMenus[i], context);
      const customId = menu.customId || `arcane:${commandConfig.name}:select:${i}`;
      const select = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(menu.placeholder || 'Select an option')
        .setMinValues(menu.minValues ?? 1)
        .setMaxValues(menu.maxValues ?? 1)
        .setDisabled(Boolean(menu.disabled))
        .addOptions((menu.options || []).map((opt, optionIndex) => ({
          label: opt.label || `Option ${optionIndex + 1}`,
          value: String(opt.value ?? `option_${optionIndex + 1}`),
          description: opt.description,
          emoji: opt.emoji,
          default: Boolean(opt.default)
        })));

      this.registerComponentAction(commandConfig.name, customId, menu, interactionScope);
      rows.push(new ActionRowBuilder().addComponents(select));
    }

    return rows;
  }

  createResponsePayload(commandConfig, source = null, extras = {}) {
    const context = this.getTemplateContext(source, extras);
    const response = this.templateValue(commandConfig.response || commandConfig.responses?.success, context);
    if (!response) {
      return { content: `Executed: ${commandConfig.name}` };
    }

    const interactionScope = source?.user?.id || source?.author?.id || null;
    const components = this.buildComponentRows(commandConfig, context, interactionScope);

    if (response.type === 'embed') {
      const embed = new EmbedBuilder();
      if (response.title) embed.setTitle(response.title);
      if (response.description) embed.setDescription(response.description);
      if (response.color) embed.setColor(response.color);
      if (response.thumbnail) {
        const thumbUrl = typeof response.thumbnail === 'string' ? response.thumbnail : response.thumbnail.url;
        if (thumbUrl) embed.setThumbnail(thumbUrl);
      }
      if (response.image) {
        const imageUrl = typeof response.image === 'string' ? response.image : response.image.url;
        if (imageUrl) embed.setImage(imageUrl);
      }
      if (response.fields && Array.isArray(response.fields)) {
        embed.setFields(
          response.fields.map((f) => ({
            name: f.name || 'Field',
            value: f.value || '-',
            inline: Boolean(f.inline)
          }))
        );
      }
      if (response.footer?.text) {
        embed.setFooter({
          text: response.footer.text,
          iconURL: response.footer.iconUrl || response.footer.iconURL
        });
      }
      if (response.timestamp) {
        embed.setTimestamp(new Date());
      }
      const payload = { embeds: [embed] };
      if (components.length) payload.components = components;
      if (commandConfig.ephemeral !== undefined) payload.ephemeral = Boolean(commandConfig.ephemeral);
      return payload;
    }

    const payload = { content: response.content || `Executed: ${commandConfig.name}` };
    if (components.length) payload.components = components;
    if (commandConfig.ephemeral !== undefined) payload.ephemeral = Boolean(commandConfig.ephemeral);
    return payload;
  }

  getComponentReplyFromAction(actionRecord, interaction) {
    const action = actionRecord?.action || {};
    const commandName = actionRecord?.commandName;
    const commandConfig = this.commandHandler.commands.get(commandName)?.config;
    const value = interaction.isStringSelectMenu() ? interaction.values?.[0] : undefined;

    if (action.responses && value && action.responses[value]) {
      return { content: action.responses[value], ephemeral: true };
    }
    if (action.response) {
      return { content: action.response, ephemeral: true };
    }
    if (commandConfig?.componentResponses?.[interaction.customId]) {
      return { content: commandConfig.componentResponses[interaction.customId], ephemeral: true };
    }
    if (interaction.isStringSelectMenu() && value) {
      return { content: `You selected: ${value}`, ephemeral: true };
    }
    return { content: 'Button clicked.', ephemeral: true };
  }

  inferEventSource(args = []) {
    for (const item of args) {
      if (!item || typeof item !== 'object') continue;
      const hasUser = item.user || item.author;
      const hasGuild = item.guild || item.guildId;
      const hasChannel = item.channel || item.channelId;
      if (hasUser || hasGuild || hasChannel) {
        return item;
      }
    }
    return null;
  }

  async dispatchEventResponse(eventConfig, args, extras) {
    const response = eventConfig.response || eventConfig.config?.response;
    if (!response) return;

    const source = this.inferEventSource(args);
    const commandLikeConfig = {
      name: `event:${eventConfig.event}`,
      response
    };
    const payload = this.createResponsePayload(commandLikeConfig, source, extras);
    delete payload.ephemeral;

    const targetChannelId = eventConfig.config?.channelId;
    if (targetChannelId && this.client?.channels?.fetch) {
      try {
        const channel = await this.client.channels.fetch(targetChannelId);
        if (channel && typeof channel.send === 'function') {
          await channel.send(payload);
          return;
        }
      } catch (error) {
        this.logger.error(
          `Failed to send event response for ${eventConfig.event} to channel ${targetChannelId}: ${error.message}`
        );
      }
    }

    if (source?.channel && typeof source.channel.send === 'function') {
      await source.channel.send(payload);
    }
  }

  async handleConfiguredEvent(entry, args) {
    const eventConfig = entry.config;
    const source = this.inferEventSource(args);
    const extras = {
      event: {
        name: eventConfig.event,
        source: entry.source
      }
    };

    const consoleMessage = eventConfig.config?.console?.message;
    if (consoleMessage) {
      const context = this.getTemplateContext(source, extras);
      this.logger.info(this.templateValue(consoleMessage, context));
    }

    if (eventConfig.package) {
      const pkg = this.packageManager.getPackage(eventConfig.package);
      if (!pkg) {
        this.logger.error(`Event ${eventConfig.event} requires unloaded package ${eventConfig.package}`);
        return;
      }
      if (typeof pkg.executeEvent !== 'function') {
        this.logger.warn(`Package ${eventConfig.package} does not implement executeEvent`);
        return;
      }
      await pkg.executeEvent(eventConfig, args, {
        client: this.client,
        config: this.config
      });
      return;
    }

    await this.dispatchEventResponse(eventConfig, args, extras);
  }

  clearConfiguredEventListeners() {
    if (!this.client) return;
    for (const listener of this.boundEventListeners) {
      this.client.removeListener(listener.event, listener.handler);
    }
    this.boundEventListeners = [];
  }

  bindConfiguredEvents() {
    if (!this.client) return;

    this.clearConfiguredEventListeners();
    const enabledEvents = this.eventHandler.getEnabledEvents();

    for (const entry of enabledEvents) {
      const eventConfig = entry.config;
      const handler = async (...args) => {
        try {
          await this.handleConfiguredEvent(entry, args);
        } catch (error) {
          this.logger.error(`Event handler failed (${eventConfig.event}): ${error.message}`);
        }
      };

      if (eventConfig.once) {
        this.client.once(eventConfig.event, handler);
      } else {
        this.client.on(eventConfig.event, handler);
      }

      this.boundEventListeners.push({
        event: eventConfig.event,
        handler
      });
    }

    this.logger.info(`Bound ${enabledEvents.length} configured event handlers`);
  }

  bindRuntimeHandlers() {
    if (this.handlersBound) {
      return;
    }

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isButton() || interaction.isStringSelectMenu()) {
        const actionRecord = this.componentRegistry.get(interaction.customId);
        if (!actionRecord) return;
        if (actionRecord.interactionScope && actionRecord.interactionScope !== interaction.user?.id) {
          await interaction.reply({ content: 'This control is no longer active.', ephemeral: true });
          return;
        }
        const payload = this.getComponentReplyFromAction(actionRecord, interaction);
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(payload);
        } else {
          await interaction.reply(payload);
        }
        return;
      }

      if (!interaction.isChatInputCommand()) return;
      try {
        const registered = this.commandHandler.commands.get(interaction.commandName);
        if (!registered) return;
        const commandConfig = registered.config;
        const result = await this.commandHandler.handleCommand(interaction, this.packageManager);
        const payload = result?.response || this.createResponsePayload(commandConfig, interaction);
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

      const payload = this.createResponsePayload(cfg, message);
      if (payload.embeds) {
        await message.reply(payload);
      } else {
        await message.reply(payload);
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
            this.bindConfiguredEvents();
          }
        }
      }
    });

    this.hotReload.start(directories);
  }
}

module.exports = ArcaneBot;
