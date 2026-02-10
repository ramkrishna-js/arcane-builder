# Testing and Quality

## Required Checks

```bash
npm test
arcane validate --strict
```

## Runtime Check

```bash
arcane dev
```

Confirm:

- startup logs clean
- command counts match file count
- slash registration logs visible
- text commands respond to prefix

## Docs Check

```bash
python -m pip install -r docs/requirements.txt
mkdocs build --strict
```
