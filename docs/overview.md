# Documentation Overview

This documentation is organized for teams shipping real bots, not just demos.

## Learning Path

1. Getting Started
2. Core Concepts
3. Implementation Guides
4. Deployment + Operations
5. API + Reference

## Audience

- Bot developers building structured Discord bots
- Package authors extending Arcane behavior
- Maintainers who need reliable deploy and test workflows

## Current Runtime Scope

Arcane currently includes:

- CLI scaffolding and generation
- Runtime loading and validation
- Command registration and interaction handling
- Component interactions (buttons/select menus)
- Development watch mode and reload hooks

## Recommended Team Workflow

1. Define command/event contracts in JSON.
2. Validate with `arcane validate --strict`.
3. Run `arcane dev` in a test guild.
4. Move to global registration when stable.
5. Deploy via `arcane deploy --pm2 --name arcanebuilder`.
