const path = require('path');
const { validateProject } = require('../utils/validator');

async function validateCommand(options = {}) {
  const result = await validateProject(process.cwd(), { strict: options.strict });

  if (result.errors.length) {
    console.error('❌ Validation failed');
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    throw new Error('Validation errors found.');
  }

  if (result.warnings.length) {
    console.warn('⚠️ Validation warnings');
    for (const warning of result.warnings) {
      console.warn(`- ${warning}`);
    }

    if (options.strict) {
      throw new Error('Strict mode failed due to warnings.');
    }
  }

  console.log('✅ Validation passed');
}

module.exports = { validateCommand };
