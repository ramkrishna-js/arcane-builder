<div align="center">

<img src="assets/branding/banner-social.svg" alt="Arcane Builder banner" />
<br>
<br>

# **Arcane Builder**
Arcane Builder is a JSON-first Discord bot framework and CLI focused on clean structure, fast iteration, and package-based extensibility.

[![License](https://img.shields.io/github/license/ramkrishna-js/arcane-builder?style=flat-square&color=%23f59e0b)](https://github.com/ramkrishna-js/arcane-builder/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/ramkrishna-js/arcane-builder?style=flat-square&color=%2322d3ee)](https://github.com/ramkrishna-js/arcane-builder/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/ramkrishna-js/arcane-builder?style=flat-square&color=%23f59e0b)](https://github.com/ramkrishna-js/arcane-builder/commits/main)
[![Docs](https://img.shields.io/badge/docs-github%20pages-22d3ee?style=flat-square)](https://ramkrishna-js.github.io/arcane-builder/)

<br>

<img src="assets/branding/features.svg" alt="Arcane Builder features" />

<br>

</div>

## Documentation

**Docs Site:** https://ramkrishna-js.github.io/arcane-builder/

Key pages:

- Home: `docs/index.md`
- Overview: `docs/overview.md`
- Architecture: `docs/reference/architecture.md`
- Local Testing: `docs/reference/local-testing.md`
- GitHub Pages Deploy: `docs/reference/github-pages.md`

## 1. Quick Start

```bash
npm install -g arcane-builder
arcane init my-bot
cd my-bot
cp .env.example .env
# set DISCORD_TOKEN in .env
arcane validate
arcane dev
```

## 2. Core CLI

```bash
arcane init <name> [--template default]
arcane create <command|event|package> <name>
arcane dev
arcane start
arcane deploy [--pm2 --name arcanebuilder]
arcane validate [--strict]
arcane package <add|remove|list> [name]
```

## 3. Why Arcane Builder

- JSON-first command/event/package architecture
- Recursive file scanning for nested project layouts
- Validation before runtime failures
- Hot reload development workflow
- Monorepo-friendly structure direction

## 4. GitHub Pages Docs Deployment

- Workflow: `.github/workflows/deploy-docs-github-pages.yml`
- MkDocs config: `mkdocs.yml`
- Docs source: `docs/`
- Build output: `site/`

## 5. Branding

- Primary hero (used above): `assets/branding/banner-social.svg`
- Secondary wide banner: `assets/branding/banner-horizontal.svg`
- Features banner: `assets/branding/features.svg`
- Logo: `assets/branding/logo.svg`

## 6. Made By

Made by Ramkrishna.
