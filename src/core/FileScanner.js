const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');

class FileScanner {
  async scanDirectory(dir, extensions = ['.json']) {
    const absoluteDir = path.resolve(dir);
    if (!(await fs.pathExists(absoluteDir))) {
      return [];
    }

    const files = [];
    const entries = await fs.readdir(absoluteDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(absoluteDir, entry.name);
      if (entry.isDirectory()) {
        const nested = await this.scanDirectory(fullPath, extensions);
        files.push(...nested);
      } else if (extensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  watch(dir, callback) {
    return chokidar.watch(dir, { ignoreInitial: true }).on('all', (event, filePath) => {
      callback({ event, filePath });
    });
  }
}

module.exports = FileScanner;
