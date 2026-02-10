const path = require('path');
const fs = require('fs-extra');

function packageConfig(name) {
  return {
    package: name,
    version: 'latest',
    enabled: true,
    config: {}
  };
}

async function packageCommand(action, name) {
  const packagesDir = path.resolve(process.cwd(), 'packages');
  await fs.ensureDir(packagesDir);

  switch (action) {
    case 'add': {
      if (!name) throw new Error('Package name is required for add');
      const fileName = name.replace(/[@/]/g, '_') + '.json';
      const filePath = path.join(packagesDir, fileName);
      await fs.writeJson(filePath, packageConfig(name), { spaces: 2 });
      console.log(`✅ Added package ${name}`);
      return;
    }
    case 'remove': {
      if (!name) throw new Error('Package name is required for remove');
      const fileName = name.replace(/[@/]/g, '_') + '.json';
      const filePath = path.join(packagesDir, fileName);
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
      console.log(`✅ Removed package ${name}`);
      return;
    }
    case 'list': {
      const files = await fs.readdir(packagesDir);
      if (!files.length) {
        console.log('No packages configured.');
        return;
      }
      for (const file of files) {
        const json = await fs.readJson(path.join(packagesDir, file));
        console.log(`- ${json.package}@${json.version}`);
      }
      return;
    }
    default:
      throw new Error('Unsupported package action. Use add/remove/list.');
  }
}

module.exports = { packageCommand };
