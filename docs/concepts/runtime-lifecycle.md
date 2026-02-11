# Runtime Lifecycle

## Startup Sequence

1. Load env (`.env`)
2. Load and normalize `arcane.config.js`
3. Scan and validate command/event/package JSON
4. Create Discord client with mapped intents/partials
5. Login and wait for ready
6. Register slash commands
7. Bind runtime handlers (`interactionCreate`, `messageCreate`)
8. Bind configured event listeners from `events/**/*.json`

## Dev Reload Sequence

1. File watcher detects update
2. Project state reloads
3. Slash commands re-register
4. Event listeners are re-bound from current config
5. Existing process keeps running

## Failure Modes

- Validation errors: block startup/deploy early
- Missing token: startup fails fast
- Network/DNS failures: login fails, surface error and retry externally
