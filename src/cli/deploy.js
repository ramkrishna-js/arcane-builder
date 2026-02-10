const path = require('path');
const { spawnSync } = require('node:child_process');
const ArcaneBot = require('../core/ArcaneBot');
const { validateProject } = require('../utils/validator');

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false
  });

  if (result.status !== 0) {
    throw new Error(`${command} failed with code ${result.status}`);
  }
}

async function deployCommand(options = {}) {
  const projectRoot = process.cwd();
  const validation = await validateProject(projectRoot, { strict: true });

  if (validation.errors.length || validation.warnings.length) {
    const details = [...validation.errors, ...validation.warnings].join('\n- ');
    throw new Error(`Deployment blocked due to validation issues:\n- ${details}`);
  }

  if (options.pm2) {
    const check = spawnSync('pm2', ['-v'], { stdio: 'ignore', shell: false });
    if (check.status !== 0) {
      throw new Error('PM2 is not installed. Install it with: npm install -g pm2');
    }

    const arcaneBin = path.resolve(__dirname, '../../bin/arcane.js');
    const processName = options.name || 'arcanebuilder';
    run('pm2', ['start', arcaneBin, '--name', processName, '--', 'start'], projectRoot);
    run('pm2', ['save'], projectRoot);
    console.log(`✅ Deployed with PM2 as process "${processName}"`);
    return;
  }

  console.log('🚀 Starting bot in foreground mode...');
  const bot = new ArcaneBot({ mode: 'deploy' });
  await bot.start();
}

module.exports = { deployCommand };
