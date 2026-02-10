const fs = require('fs-extra');
const FileScanner = require('./FileScanner');

class CommandHandler {
  constructor({ validator }) {
    this.scanner = new FileScanner();
    this.validator = validator;
    this.commands = new Map();
  }

  async loadCommands(dir) {
    this.commands.clear();
    const files = await this.scanner.scanDirectory(dir, ['.json']);
    const errors = [];

    for (const file of files) {
      try {
        const command = await fs.readJson(file);
        const result = this.validator.validateCommand(command);

        if (!result.valid) {
          errors.push(`${file}: ${result.errors.join('; ')}`);
          continue;
        }

        this.commands.set(command.name, { config: command, source: file });
      } catch (error) {
        errors.push(`${file}: ${error.message}`);
      }
    }

    if (errors.length) {
      throw new Error(`Command loading failed:\n${errors.join('\n')}`);
    }

    return this.commands;
  }

  async handleCommand(interaction, packageManager) {
    const commandName = interaction.commandName || interaction.name;
    const registered = this.commands.get(commandName);

    if (!registered) {
      throw new Error(`Unknown command: ${commandName}`);
    }

    const commandConfig = registered.config;

    if (!commandConfig.package) {
      return { ok: true, handledBy: 'core', response: commandConfig.response || null };
    }

    const pkg = packageManager.getPackage(commandConfig.package);
    if (!pkg) {
      throw new Error(`Package not loaded: ${commandConfig.package}`);
    }

    if (typeof pkg.executeCommand !== 'function') {
      throw new Error(`Package ${commandConfig.package} does not implement executeCommand`);
    }

    return pkg.executeCommand(commandConfig, interaction);
  }
}

module.exports = CommandHandler;
