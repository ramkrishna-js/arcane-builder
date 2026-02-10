class PackageRegistry {
  constructor({ baseUrl = 'https://registry.arcane.dev' } = {}) {
    this.baseUrl = baseUrl;
  }
}

module.exports = PackageRegistry;
