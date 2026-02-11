const fs = require('fs-extra');
const FileScanner = require('./FileScanner');

class EventHandler {
  constructor({ validator }) {
    this.scanner = new FileScanner();
    this.validator = validator;
    this.events = new Map();
  }

  async loadEvents(dir) {
    this.events.clear();
    const files = await this.scanner.scanDirectory(dir, ['.json']);
    const errors = [];

    for (const file of files) {
      try {
        const eventConfig = await fs.readJson(file);
        const result = this.validator.validateEvent(eventConfig);
        if (!result.valid) {
          errors.push(`${file}: ${result.errors.join('; ')}`);
          continue;
        }

        const key = `${eventConfig.event}:${file}`;
        this.events.set(key, { config: eventConfig, source: file });
      } catch (error) {
        errors.push(`${file}: ${error.message}`);
      }
    }

    if (errors.length) {
      throw new Error(`Event loading failed:\n${errors.join('\n')}`);
    }

    return this.events;
  }

  getEnabledEvents() {
    return [...this.events.values()].filter((entry) => entry?.config?.enabled !== false);
  }
}

module.exports = EventHandler;
