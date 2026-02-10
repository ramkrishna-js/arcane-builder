# Troubleshooting

## `Config file not found`

Create `arcane.config.js` in the project root.

## `Validation errors found`

Run `arcane validate`, inspect file path in error, fix schema mismatch.

## `Unknown command`

Check command `name` and confirm file is under `commands/`.

## `Package not loaded`

Ensure package file exists in `packages/` and `enabled` is `true`.

## Hot reload not triggering

- Confirm `arcane dev` is running
- Confirm edits are inside configured directories
