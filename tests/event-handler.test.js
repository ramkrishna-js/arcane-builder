const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const EventHandler = require('../src/core/EventHandler');
const { Validator } = require('../src/utils/validator');

test('EventHandler loads multiple files for same event name', async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'arcane-events-'));
  const eventsDir = path.join(tmp, 'events');
  await fs.ensureDir(eventsDir);

  await fs.writeJson(path.join(eventsDir, 'ready-log.json'), {
    event: 'ready',
    enabled: true,
    once: true,
    config: {
      console: {
        message: '{{bot.tag}} online'
      }
    }
  });

  await fs.writeJson(path.join(eventsDir, 'ready-metrics.json'), {
    event: 'ready',
    enabled: true,
    config: {}
  });

  const handler = new EventHandler({ validator: new Validator() });
  await handler.loadEvents(eventsDir);

  assert.equal(handler.events.size, 2);
  assert.equal(handler.getEnabledEvents().length, 2);
});

