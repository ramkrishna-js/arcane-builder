# Local Testing

Use this checklist to validate Arcane changes locally before pushing.

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Unit Tests

```bash
npm test
```

## 3. CLI Smoke Test

```bash
tmpdir=$(mktemp -d)
node bin/arcane.js init "$tmpdir/bot" --yes
cd "$tmpdir/bot"
node /home/ramkrishna0/Desktop/arcane-builder/bin/arcane.js validate
```

If validation passes, generated template and schemas are consistent.

## 4. Runtime Connectivity Check

```bash
arcane dev
```

Expected behavior:

- Bot logs in successfully
- Commands are loaded
- Slash commands are registered

## 5. Docs Build Check

```bash
python -m pip install -r docs/requirements.txt
mkdocs build --strict
```

## Recommended Pre-Push Gate

1. `npm test`
2. `mkdocs build --strict`
3. CLI smoke test
4. `arcane dev` startup sanity
