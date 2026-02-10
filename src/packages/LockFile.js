const path = require('path');
const fs = require('fs-extra');

class LockFile {
  constructor(rootDir = process.cwd()) {
    this.path = path.join(rootDir, '.arcane', 'arcane.lock.json');
  }

  async read() {
    if (!(await fs.pathExists(this.path))) {
      return { packages: {} };
    }
    return fs.readJson(this.path);
  }

  async write(lockData) {
    await fs.ensureDir(path.dirname(this.path));
    await fs.writeJson(this.path, lockData, { spaces: 2 });
  }
}

module.exports = LockFile;
