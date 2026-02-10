const test = require('node:test');
const assert = require('node:assert/strict');
const { Validator } = require('../src/utils/validator');

test('Validator.validateCommand validates command schema', () => {
  const validator = new Validator();
  const valid = validator.validateCommand({
    name: 'ping',
    description: 'Ping command',
    type: 'both'
  });
  assert.equal(valid.valid, true);

  const invalid = validator.validateCommand({
    name: 'INVALID NAME',
    description: 'x'
  });
  assert.equal(invalid.valid, false);
});
