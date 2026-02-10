# CLI Reference

## `arcane init <name> [options]`

Create a new Arcane project from template.

Common options:

- `--template <name>`
- `--description <text>`
- `--bot-name <name>`
- `--yes` (skip prompts, use defaults)
- `--no-install` (skip dependency install)

## `arcane create <command|event|package> <name>`

Generate JSON config files in the correct directory.

## `arcane dev`

Run in development mode with file watching and hot reload.

## `arcane start`

Run bot in production-style foreground mode.

## `arcane deploy [--pm2 --name arcanebuilder]`

Deploy command with strict validation.

- Without `--pm2`: starts bot in foreground deploy mode.
- With `--pm2`: starts and saves a PM2 process.

## `arcane validate [--strict]`

Validate project config and all JSON files.

## `arcane package <add|remove|list> [name]`

Manage package config files in `packages/`.
