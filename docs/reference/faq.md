# FAQ

## Is Arcane production-ready?

Arcane is production-oriented for structured command/event bots. Core command execution, interaction handling, and JSON-configured event execution are implemented. The remote package registry pipeline is still MVP/stubbed.

## Do I need to write JavaScript for commands?

For config and structure, no. Command/event definitions are JSON-first. Advanced runtime behavior for package authors still uses JavaScript modules.

## Where should secrets go?

Use `.env` for secrets (`DISCORD_TOKEN`, API keys). Keep config files non-secret.

## Can Arcane work in a monorepo?

Yes. Current layout is already split by concerns and can be moved into `packages/*` and `apps/docs` with minimal changes.

## Why does `mkdocs build --strict` fail?

Typical causes:

- bad nav path in `mkdocs.yml`
- missing referenced file/image
- duplicate index/readme path conflicts

## Why does `arcane validate` fail?

Most failures are schema mismatches in JSON files. Fix the first reported file, rerun, and continue until clean.
