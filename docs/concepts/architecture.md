# Architecture

Arcane separates project intent (JSON) from runtime execution (framework core).

## Layers

1. Project Layer: `arcane.config.js`, `commands/`, `events/`, `packages/`
2. Runtime Layer: loaders, validators, registries, handlers
3. Platform Layer: Discord gateway/interactions and process manager

## Core Modules

- `ConfigLoader`: loads and normalizes config defaults
- `FileScanner`: recursive JSON discovery
- `Validator`: schema checks and error reporting
- `CommandHandler`: command registry and package routing
- `EventHandler`: event config registry
- `ArcaneBot`: runtime orchestration, Discord client, command sync
- `HotReload`: watch + reload project state

## Design Goal

Keep bot behavior explainable from files first. Runtime code should orchestrate, not hide config intent.
