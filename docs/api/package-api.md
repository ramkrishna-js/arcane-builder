# Package API

Arcane package modules are expected to expose runtime hooks.

## Constructor

```js
new Package(arcane, config)
```

## Optional Methods

- `init()`
- `destroy()`
- `getCommands()`
- `getEvents()`
- `getUtilities()`
- `getContext()`

## Command Execution Contract

Package-backed commands should resolve to a handler and return a structured result:

```js
{
  ok: true,
  handledBy: '@arcane/music'
}
```

## Errors

Throw typed errors with actionable messages whenever possible.
