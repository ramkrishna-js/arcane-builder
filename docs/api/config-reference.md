# Config Reference

`arcane.config.js` supports these top-level keys.

## `name`

- Type: `string`
- Purpose: Display/project name

## `version`

- Type: `string`
- Purpose: Project version metadata

## `bot`

- Type: `object`
- Common keys: `token`, `clientId`, `prefix`, `intents`, `presence`

## `directories`

- Type: `object`
- Keys: `commands`, `events`, `packages`, `data`, `assets`, `logs`

## `registry`

- Type: `object`
- Keys: `url`, `cdn`, `cache`, `cacheDuration`, `timeout`

## `settings`

- Type: `object`
- Includes logging, command defaults, feature toggles

## `owners`

- Type: `string[]`
- Purpose: privileged user IDs

## `permissions`

- Type: `object`
- Purpose: global role/user permission groups
