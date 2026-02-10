const path = require('path');
const fs = require('fs-extra');

async function initCommand(name, options = {}) {
  const templateName = options.template || 'default';
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
        name,
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'arcane dev',
          start: 'arcane start',
          validate: 'arcane validate'
        }
      },
      { spaces: 2 }
    );
  }

  console.log(`✅ Arcane project created at ${targetDir}`);
  console.log('Next steps:');
  console.log(`1. cd ${name}`);
  console.log('2. cp .env.example .env and set DISCORD_TOKEN');
  console.log('3. arcane dev');
}

module.exports = { initCommand };
