const path = require('path');
const FileScanner = require('./FileScanner');

class HotReload {
  constructor({ onReload }) {
    this.scanner = new FileScanner();
    this.onReload = onReload;
    this.watchers = [];
  }

  start(directories) {
    for (const dir of directories) {
      const watcher = this.scanner.watch(dir, async ({ event, filePath }) => {
        await this.onReload({
          event,
          filePath: path.resolve(filePath)
        });
      });
      this.watchers.push(watcher);
    }
  }

  async stop() {
    await Promise.all(this.watchers.map((watcher) => watcher.close()));
    this.watchers = [];
  }
}

module.exports = HotReload;
