# Contributing to Arcane Builder

Thanks for contributing.

## Ground Rules

- Keep changes focused and small.
- Add or update docs for user-facing behavior.
- Run tests before opening a PR.
- Do not commit secrets (`.env`, tokens, keys).

## Development Setup

```bash
git clone https://github.com/ramkrishna-js/arcane-builder.git
cd arcane-builder
npm install
```

## Local Validation Checklist

```bash
npm test
python -m pip install -r docs/requirements.txt
mkdocs build --strict
```

## Commit Style

Use clear prefixes:

- `feat:` new behavior
- `fix:` bug fix
- `docs:` docs only
- `chore:` maintenance
- `refactor:` internal improvements

## Pull Request Expectations

- Include a short problem statement.
- Explain what changed and why.
- Include test steps and outcomes.
- Attach logs/screenshots for runtime or UI behavior changes.

## Areas That Need Help

- Discord runtime coverage
- Package registry and remote loading
- Validation error quality
- Docs/examples quality
