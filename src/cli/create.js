const path = require('path');
const fs = require('fs-extra');

function commandTemplate(name) {
  return {
    name,
    description: `Description for ${name}`,
    category: 'general',
    type: 'both',
    package: null,
    cooldown: 3,
    ephemeral: false,
    response: {
      type: 'message',
      content: `Hello from ${name}!`
    }
  };
}

function eventTemplate(name) {
  return {
    event: name,
    enabled: true,
    package: null,
    config: {}
  };
}

function packageTemplate(name) {
  return {
    package: name.startsWith('@') ? name : `@arcane/${name}`,
    version: 'latest',
    enabled: true,
    config: {}
  };
}

async function writeJsonFile(filePath, content) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, content, { spaces: 2 });
  console.log(`✅ Created ${path.relative(process.cwd(), filePath)}`);
}

async function createCommand(type, name) {
  const normalizedType = String(type || '').toLowerCase();

  if (normalizedType === 'command') {
    const filePath = path.resolve(process.cwd(), 'commands', `${name}.json`);
    return writeJsonFile(filePath, commandTemplate(path.basename(name)));
  }

  if (normalizedType === 'event') {
    const filePath = path.resolve(process.cwd(), 'events', `${name}.json`);
    return writeJsonFile(filePath, eventTemplate(name));
  }

  if (normalizedType === 'package') {
    const filePath = path.resolve(process.cwd(), 'packages', `${name}.json`);
    return writeJsonFile(filePath, packageTemplate(name));
  }

  throw new Error('Type must be one of: command, event, package');
}

module.exports = { createCommand };
