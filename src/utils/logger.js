function createLogger(scope) {
  function log(level, message) {
    const stamp = new Date().toISOString();
    console.log(`[${stamp}] [${scope}] [${level}] ${message}`);
  }

  return {
    info: (msg) => log('INFO', msg),
    warn: (msg) => log('WARN', msg),
    error: (msg) => log('ERROR', msg),
    debug: (msg) => log('DEBUG', msg)
  };
}

module.exports = {
  createLogger
};
