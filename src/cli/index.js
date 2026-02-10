const { Command } = require('commander');
const { initCommand } = require('./init');
const { createCommand } = require('./create');
const { devCommand } = require('./dev');
const { startCommand } = require('./start');
const { validateCommand } = require('./validate');
const { packageCommand } = require('./package');

async function runCli(argv) {
  const program = new Command();

  program
    .name('arcane')
    .description('Arcane Builder CLI')
    .version('0.1.0');

  program
    .command('init <name>')
    .description('Initialize a new Arcane bot project')
    .option('-t, --template <template>', 'Template name', 'default')
    .action((name, options) => initCommand(name, options));

  program
    .command('create <type> <name>')
    .description('Create command, event, or package config')
    .action((type, name) => createCommand(type, name));

  program
    .command('dev')
    .description('Run bot in development mode with hot reload')
    .action(() => devCommand());

  program
    .command('start')
    .description('Run bot in production mode')
    .action(() => startCommand());

  program
    .command('validate')
    .description('Validate Arcane configuration files')
    .option('--strict', 'Fail on warnings', false)
    .action((options) => validateCommand(options));

  program
    .command('package <action> [name]')
    .description('Manage packages (add/remove/list)')
    .action((action, name) => packageCommand(action, name));

  await program.parseAsync(argv);
}

module.exports = { runCli };
