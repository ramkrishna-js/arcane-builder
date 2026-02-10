const ArcaneBot = require('../core/ArcaneBot');

async function startCommand() {
  const bot = new ArcaneBot({ mode: 'start' });
  await bot.start();
}

module.exports = { startCommand };
