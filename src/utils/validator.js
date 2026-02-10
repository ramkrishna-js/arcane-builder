const path = require('path');
const fs = require('fs-extra');
const Ajv = require('ajv');
const FileScanner = require('../core/FileScanner');

const commandSchema = {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    name: { type: 'string', pattern: '^[a-z0-9_-]+$' },
    description: { type: 'string', maxLength: 100 },
    type: { enum: ['slash', 'text', 'both'] },
    package: { type: ['string', 'null'] },
    options: { type: 'array' },
    permissions: { type: 'object' },
    cooldown: { type: 'number', minimum: 0 }
  },
  additionalProperties: true
};

const eventSchema = {
  type: 'object',
  required: ['event'],
  properties: {
    event: { type: 'string' },
    enabled: { type: 'boolean' },
    package: { type: ['string', 'null'] },
    config: { type: 'object' }
  },
  additionalProperties: true
};

const packageSchema = {
  type: 'object',
  required: ['package'],
  properties: {
    package: { type: 'string' },
    version: { type: 'string' },
    enabled: { type: 'boolean' },
    config: { type: 'object' }
  },
  additionalProperties: true
};

class Validator {
  constructor() {
    const ajv = new Ajv({ allErrors: true });
    this.validateCommandFn = ajv.compile(commandSchema);
    this.validateEventFn = ajv.compile(eventSchema);
    this.validatePackageFn = ajv.compile(packageSchema);
  }

  validateCommand(data) {
    const valid = this.validateCommandFn(data);
    return { valid, errors: valid ? [] : formatAjvErrors(this.validateCommandFn.errors) };
  }

  validateEvent(data) {
    const valid = this.validateEventFn(data);
    return { valid, errors: valid ? [] : formatAjvErrors(this.validateEventFn.errors) };
  }

  validatePackage(data) {
    const valid = this.validatePackageFn(data);
    return { valid, errors: valid ? [] : formatAjvErrors(this.validatePackageFn.errors) };
  }
}

function formatAjvErrors(errors = []) {
  return errors.map((error) => `${error.instancePath || '/'} ${error.message}`.trim());
}

async function validateProject(rootDir, { strict = false } = {}) {
  const errors = [];
  const warnings = [];
  const scanner = new FileScanner();
  const validator = new Validator();

  const configPath = path.join(rootDir, 'arcane.config.js');
  if (!(await fs.pathExists(configPath))) {
    errors.push('Missing arcane.config.js');
  }

  const commandFiles = await scanner.scanDirectory(path.join(rootDir, 'commands'));
  const eventFiles = await scanner.scanDirectory(path.join(rootDir, 'events'));
  const packageFiles = await scanner.scanDirectory(path.join(rootDir, 'packages'));

  for (const file of commandFiles) {
    const result = validator.validateCommand(await fs.readJson(file));
    if (!result.valid) {
      errors.push(`[Command] ${file}: ${result.errors.join('; ')}`);
    }
  }

  for (const file of eventFiles) {
    const result = validator.validateEvent(await fs.readJson(file));
    if (!result.valid) {
      errors.push(`[Event] ${file}: ${result.errors.join('; ')}`);
    }
  }

  for (const file of packageFiles) {
    const result = validator.validatePackage(await fs.readJson(file));
    if (!result.valid) {
      errors.push(`[Package] ${file}: ${result.errors.join('; ')}`);
    }
  }

  if (!commandFiles.length) {
    warnings.push('No command files found in commands/.');
  }

  if (!eventFiles.length) {
    warnings.push('No event files found in events/.');
  }

  if (!packageFiles.length && strict) {
    warnings.push('No package files found in packages/.');
  }

  return { errors, warnings };
}

module.exports = {
  Validator,
  validateProject
};
