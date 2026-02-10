# GitHub Pages Deployment

This project is configured to deploy docs with GitHub Pages.

## GitHub Repository

- `https://github.com/ramkrishna-js/arcane-builder`

## One-time repository settings

1. Open repository Settings -> Pages.
2. Under Build and deployment, set Source to `GitHub Actions`.

## Automated deployment flow

The workflow file is:

- `.github/workflows/deploy-docs-github-pages.yml`

It triggers on pushes to `main` when docs-related files change.

## Local validation before push

```bash
python -m pip install -r docs/requirements.txt
mkdocs build --strict
```

## Output URL

Expected docs URL:

- `https://ramkrishna-js.github.io/arcane-builder/`
