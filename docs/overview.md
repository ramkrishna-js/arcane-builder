# Arcane Documentation Overview

Made by Ramkrishna.

Arcane Builder is a JSON-first Discord bot framework designed around file-based configuration and CLI workflows.

## What You Can Do Today

- Scaffold bot projects with `arcane init`
- Generate config files with `arcane create`
- Validate command/event/package JSON with `arcane validate`
- Run development mode with hot reload hooks using `arcane dev`
- Manage package config files with `arcane package`

## MVP Boundaries (Important)

Current scope is framework and tooling heavy:

- Core loader/scanner/validator path is implemented
- Full Discord runtime behavior is still evolving
- Remote package registry fetch is currently stubbed

## Recommended Reading Order

1. `getting-started/quickstart.md`
2. `guides/configuration.md`
3. `guides/commands.md`
4. `reference/architecture.md`
5. `reference/local-testing.md`

## Documentation Sections

- Getting Started: install and first project boot
- Guides: command/event/package authoring workflows
- API: CLI and config references
- Examples: practical project templates
- Reference: architecture, troubleshooting, deployment, roadmap
