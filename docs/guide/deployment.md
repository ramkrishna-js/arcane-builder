# Deployment Guide

## Preflight

```bash
arcane validate --strict
```

## Foreground Run

```bash
arcane deploy
```

## PM2 Deployment

```bash
arcane deploy --pm2 --name arcanebuilder
```

Or use scaffolded helper:

```bash
./deploy.sh
```

## PM2 Operations

```bash
pm2 status
pm2 logs arcanebuilder
pm2 restart arcanebuilder
```
