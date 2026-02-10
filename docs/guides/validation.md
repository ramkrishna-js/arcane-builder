# Validation and Errors

Arcane validates config and JSON files before runtime.

## Run Validation

```bash
arcane validate
arcane validate --strict
```

## What Is Validated

- `arcane.config.js` exists and loads
- `commands/**/*.json` against command schema
- `events/**/*.json` against event schema
- `packages/**/*.json` against package schema

## Common Failures

- Invalid command name pattern (must be lowercase slug)
- Missing required fields (`name`, `description`, `event`, `package`)
- Type mismatch (string vs number/boolean)

## Debug Workflow

1. Run `arcane validate`.
2. Fix first reported file.
3. Re-run until clean.
4. Use `--strict` in CI.
