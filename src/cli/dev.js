const ArcaneBot = require('../core/ArcaneBot');

async function devCommand() {
  const bot = new ArcaneBot({ mode: 'dev' });
  await bot.start();
  await bot.enableHotReload();
  console.log('👀 Watching for changes...');
}

module.exports = { devCommand };
