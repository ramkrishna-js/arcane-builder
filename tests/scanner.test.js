const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const FileScanner = require('../src/core/FileScanner');

test('FileScanner.scanDirectory finds nested json files', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'arcane-scan-'));
  const nestedDir = path.join(tmp, 'commands', 'music');
  await fs.ensureDir(nestedDir);
  await fs.writeFile(path.join(nestedDir, 'play.json'), '{}');
  await fs.writeFile(path.join(tmp, 'commands', 'ignore.txt'), 'x');

  const scanner = new FileScanner();
  const results = await scanner.scanDirectory(path.join(tmp, 'commands'));

  assert.equal(results.length, 1);
  assert.equal(path.basename(results[0]), 'play.json');
});
