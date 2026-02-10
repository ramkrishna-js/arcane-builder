const path = require('path');
const fs = require('fs-extra');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { spawnSync } = require('node:child_process');

function toPackageName(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'arcanebuilder-bot';
}

function escapeSingleQuotes(value) {
  return String(value || '').replace(/'/g, "\\'");
}

async function askQuestion(rl, prompt, defaultValue) {
  const label = defaultValue ? `${prompt} (${defaultValue}): ` : `${prompt}: `;
  const answer = (await rl.question(label)).trim();
  return answer || defaultValue;
}

async function collectInitAnswers(name, options = {}) {
  const defaults = {
    template: options.template || 'default',
    description: options.description || 'A Discord bot built with Arcane Builder',
    botName: options.botName || 'arcanebuilder',
    install: options.install !== false,
    packageName: toPackageName(name)
  };

  if (options.yes) {
    return defaults;
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const template = await askQuestion(rl, 'Template', defaults.template);
    const packageName = toPackageName(await askQuestion(rl, 'Package name', defaults.packageName));
    const botName = await askQuestion(rl, 'Bot name', defaults.botName);
    const description = await askQuestion(rl, 'Description', defaults.description);
    const installAnswer = await askQuestion(rl, 'Install dependencies now? (Y/n)', 'Y');
    const install = !/^n(o)?$/i.test(installAnswer);
    return { template, packageName, botName, description, install };
  } finally {
    rl.close();
  }
}

async function updateScaffoldFiles(targetDir, answers) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const arcaneConfigPath = path.join(targetDir, 'arcane.config.js');

  if (await fs.pathExists(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    pkg.name = answers.packageName;
    pkg.description = answers.description;
    pkg.scripts = {
      ...(pkg.scripts || {}),
      deploy: 'arcane deploy --pm2 --name arcanebuilder'
    };
    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  }

  if (await fs.pathExists(arcaneConfigPath)) {
    let configText = await fs.readFile(arcaneConfigPath, 'utf8');
    configText = configText.replace(/name:\s*'[^']*'/, `name: '${escapeSingleQuotes(answers.botName)}'`);
    configText = configText.replace(
      /description:\s*'[^']*'/,
      `description: '${escapeSingleQuotes(answers.description)}'`
    );
    await fs.writeFile(arcaneConfigPath, configText, 'utf8');
  }

  const deployScriptPath = path.join(targetDir, 'deploy.sh');
  const deployScript = `#!/usr/bin/env bash
set -euo pipefail
arcane deploy --pm2 --name arcanebuilder
`;
  await fs.writeFile(deployScriptPath, deployScript, 'utf8');
  await fs.chmod(deployScriptPath, 0o755);
}

function runInstall(targetDir) {
  const result = spawnSync('npm', ['install'], {
    cwd: targetDir,
    stdio: 'inherit',
    shell: false
  });

  if (result.status !== 0) {
    throw new Error('npm install failed in new project.');
  }
}

async function initCommand(name, options = {}) {
  const answers = await collectInitAnswers(name, options);
  const templateName = answers.template;
  const targetDir = path.resolve(process.cwd(), name);
  const templateDir = path.resolve(__dirname, `../templates/${templateName}`);

  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  if (await fs.pathExists(targetDir)) {
    throw new Error(`Directory already exists: ${targetDir}`);
  }

  await fs.copy(templateDir, targetDir);
  await fs.ensureDir(path.join(targetDir, '.arcane', 'cache'));

  const envExamplePath = path.join(targetDir, '.env.example');
  if (!(await fs.pathExists(envExamplePath))) {
    await fs.writeFile(
      envExamplePath,
      'DISCORD_TOKEN=\nCLIENT_ID=\nNODE_ENV=development\n',
      'utf8'
    );
  }

  const packageJsonPath = path.join(targetDir, 'package.json');
  if (!(await fs.pathExists(packageJsonPath))) {
    await fs.writeJson(
      packageJsonPath,
      {
        name: answers.packageName,
        version: '1.0.0',
        private: true,
        description: answers.description,
        scripts: {
          dev: 'arcane dev',
          start: 'arcane start',
          validate: 'arcane validate'
        }
      },
      { spaces: 2 }
    );
  }

  await updateScaffoldFiles(targetDir, answers);

  if (answers.install) {
    console.log('📦 Installing dependencies...');
    runInstall(targetDir);
  }

  console.log(`✅ Arcane project created at ${targetDir}`);
  console.log('Next steps:');
  console.log(`1. cd ${name}`);
  console.log('2. cp .env.example .env and set DISCORD_TOKEN');
  console.log('3. arcane dev');
}

module.exports = { initCommand };
