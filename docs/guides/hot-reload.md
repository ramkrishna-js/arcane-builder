# Hot Reload and Dev Flow

`arcane dev` watches project directories and reloads runtime state on file changes.

## Tracked Paths

By default, Arcane watches paths from `config.directories`:

- commands
- events
- packages
- data
- assets
- logs

## Workflow

1. Start: `arcane dev`
2. Edit a JSON file
3. Arcane detects file event
4. Arcane reloads in-memory config/handlers

## Team Tips

- Keep edits small and atomic.
- Validate before large refactors.
- For risky changes, keep `dev` logs open in a separate terminal.
