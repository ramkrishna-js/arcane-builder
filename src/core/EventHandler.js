const fs = require('fs-extra');
const FileScanner = require('./FileScanner');

class EventHandler {
  constructor({ validator }) {
    this.scanner = new FileScanner();
    this.validator = validator;
    this.events = new Map();
  }

  async loadEvents(dir) {
    const files = await this.scanner.scanDirectory(dir, ['.json']);

    for (const file of files) {
      const eventConfig = await fs.readJson(file);
      const result = this.validator.validateEvent(eventConfig);
      if (!result.valid) {
        throw new Error(`${file}: ${result.errors.join('; ')}`);
      }
      this.events.set(eventConfig.event, { config: eventConfig, source: file });
    }

    return this.events;
  }
}

module.exports = EventHandler;
