const path = require('path');
const fs = require('fs-extra');
const RemoteLoader = require('./RemoteLoader');

class PackageManager {
  constructor() {
    this.remoteLoader = new RemoteLoader();
    this.packages = new Map();
  }

  async loadConfiguredPackages(packagesDir) {
    if (!(await fs.pathExists(packagesDir))) {
      return;
    }

    const files = await fs.readdir(packagesDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const cfg = await fs.readJson(path.join(packagesDir, file));
      if (cfg.enabled === false) continue;
      const pkg = await this.loadPackage(cfg.package, cfg.version || 'latest', cfg.config || {});
      this.packages.set(cfg.package, pkg);
    }
  }

  async loadPackage(packageName, version = 'latest', config = {}) {
    const loaded = await this.remoteLoader.fetch(packageName, version);
    return {
      name: packageName,
      version,
      config,
      ...loaded
    };
  }

  getPackage(name) {
    return this.packages.get(name);
  }

  getUtilities(name) {
    const pkg = this.packages.get(name);
    if (!pkg || typeof pkg.getUtilities !== 'function') {
      return null;
    }
    return pkg.getUtilities();
  }

  size() {
    return this.packages.size;
  }
}

module.exports = PackageManager;
