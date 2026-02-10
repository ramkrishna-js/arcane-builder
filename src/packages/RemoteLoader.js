class RemoteLoader {
  async fetch(packageName, version) {
    return {
      executeCommand: async () => ({
        ok: true,
        handledBy: packageName,
        version,
        note: 'Remote package execution is not implemented in MVP.'
      })
    };
  }
}

module.exports = RemoteLoader;
