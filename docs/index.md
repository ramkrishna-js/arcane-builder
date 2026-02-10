# Arcane Builder

Made by Ramkrishna.

![Arcane Builder](assets/banner-social.svg)

Arcane Builder is a production-oriented, JSON-first Discord bot framework. It gives teams a clean file architecture, a CLI workflow, runtime validation, and fast iteration loops.

## Why This Exists

Most Discord bot projects start clean and become hard to reason about at scale. Arcane enforces a structure where commands, events, and package settings remain explicit and reviewable.

## Start Here

1. `getting-started/installation.md`
2. `getting-started/quickstart.md`
3. `guide/command-workflow.md`
4. `guide/interactions-components.md`
5. `guide/deployment.md`

## Core Capabilities

- File-first command and event definitions
- Runtime schema validation before failure cascades
- Slash + text command support
- Buttons and dropdown/select interactions
- Hot reload during development
- PM2 deployment path for long-running bots

## Production Notes

- Use `settings.devGuild` while developing slash commands for instant updates.
- Remove `settings.devGuild` for global command registration.
- Always run `arcane validate --strict` before deployment.

## Documentation Tracks

- Concepts: architecture and lifecycle model
- Guide: step-by-step implementation patterns
- Recipes: copyable patterns for common bot features
- API: exact command/config reference
- Reference: troubleshooting, local testing, roadmap
