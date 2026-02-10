# Arcane Builder

![Arcane Builder Banner](assets/branding/banner-horizontal.svg)

Made by Ramkrishna.

Arcane Builder is a file-first Discord bot framework CLI. Build bots from JSON configuration without writing command runtime glue in every project.

## Why Arcane

- File-based architecture for commands, events, and packages
- Recursive loading for large projects
- Schema validation with fast feedback
- Hot reload in development mode
- Extensible package system for feature domains

## Install

```bash
npm install -g arcane-builder
```

For framework development:

```bash
npm install
npm link
```

## CLI

```bash
arcane init <name> [--template default]
arcane create <command|event|package> <name>
arcane dev
arcane start
arcane validate [--strict]
arcane package <add|remove|list> [name]
```

## Quick Usage

```bash
arcane init my-bot
cd my-bot
cp .env.example .env
# set DISCORD_TOKEN in .env
arcane validate
arcane dev
```

## Docs (MkDocs + GitHub Pages)

```bash
python -m pip install -r docs/requirements.txt
mkdocs serve
mkdocs build
```

Deploy options:

1. Enable GitHub Pages with source set to `GitHub Actions`.
2. Push to `main` and let `.github/workflows/deploy-docs-github-pages.yml` deploy automatically.
3. Docs URL: `https://ramkrishna-js.github.io/arcane-builder/`

Main docs index: `docs/index.md`

## Monorepo-Ready Direction

If we convert to a monorepo later, recommended top-level layout:

```text
apps/
  docs/
packages/
  arcane-cli/
  arcane-core/
  arcane-packages/
```

The current docs and branding are already isolated so they can move into `apps/docs` with minimal changes.

## Branding

- Logo: `assets/branding/logo.svg`
- Horizontal Banner: `assets/branding/banner-horizontal.svg`
- Social Banner: `assets/branding/banner-social.svg`

## Status

Current implementation includes CLI scaffolding, runtime loaders, validation, default template generation, and test coverage for core utility paths.
