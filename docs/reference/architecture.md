# Architecture

Arcane Builder currently ships as an MVP runtime and CLI scaffold.

## High-Level Flow

1. CLI command is invoked (`arcane init`, `arcane dev`, etc.).
2. `ArcaneBot` loads environment and `arcane.config.js`.
3. Directory mappings are resolved (`commands`, `events`, `packages`).
4. JSON files are recursively scanned and validated.
5. Command/Event maps are loaded into memory.
6. Package configs are loaded through `PackageManager`.
7. In dev mode, `HotReload` watches configured directories.

## Core Modules

- `src/core/ArcaneBot.js`: runtime bootstrap orchestration
- `src/core/ConfigLoader.js`: config load + default merge
- `src/core/FileScanner.js`: recursive file discovery
- `src/core/CommandHandler.js`: command registration + routing bridge
- `src/core/EventHandler.js`: event config registration
- `src/core/HotReload.js`: file watch + reload callback
- `src/packages/PackageManager.js`: package config loader
- `src/packages/RemoteLoader.js`: package fetch stub (MVP)
- `src/utils/validator.js`: AJV schemas + project validation

## Runtime Status

Current implementation is intentionally lightweight:

- CLI scaffolding: implemented
- JSON schema validation: implemented
- Directory scanning: implemented
- Hot reload hooks: implemented
- Full Discord.js execution loop: planned
- Real remote package registry fetch: planned

## Request Lifecycle (Current MVP)

1. Load config and validate static JSON.
2. Build in-memory command/event registries.
3. Resolve package-backed command to package handler if available.
4. Return structured result or throw actionable error.

## Design Principles

- File-first over code-first for bot configuration
- Fast feedback loops (`validate`, `dev` watch mode)
- Clear separation between framework core and package features
- Monorepo-ready code layout for future split into multiple packages
