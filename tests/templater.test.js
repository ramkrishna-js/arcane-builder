const test = require('node:test');
const assert = require('node:assert/strict');
const { renderTemplate } = require('../src/utils/templater');

test('renderTemplate replaces simple variables', () => {
  const text = 'Hello {{user.name}}';
  const result = renderTemplate(text, { user: { name: 'Arcane' } });
  assert.equal(result, 'Hello Arcane');
});

test('renderTemplate preserves missing values', () => {
  const text = 'Hi {{user.missing}}';
  const result = renderTemplate(text, { user: {} });
  assert.equal(result, 'Hi {{user.missing}}');
});
