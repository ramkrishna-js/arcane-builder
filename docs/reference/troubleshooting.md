# Troubleshooting

## `Config file not found`

Cause: `arcane.config.js` is missing from project root.

Fix:

1. Ensure you are in bot project root.
2. Create `arcane.config.js`.
3. Re-run `arcane validate`.

## `Validation errors found`

Cause: command/event/package JSON does not match schema.

Fix:

1. Run `arcane validate`.
2. Fix first listed error path.
3. Re-run until no errors remain.

## Bot is online but commands do not show

Cause (common):

- missing `applications.commands` invite scope
- global command propagation delay
- command `type` not slash-capable

Fix:

1. Reinvite bot with `bot` + `applications.commands` scopes.
2. Use `settings.devGuild` for instant guild registration while testing.
3. Ensure command `type` is `slash` or `both`.
4. Restart `arcane dev` and check registration logs.

## Text command not responding

Cause:

- prefix mismatch
- command type is not `text`/`both`

Fix:

1. Check `bot.prefix` in config.
2. Ensure command `type` is `text` or `both`.
3. Verify `MessageContent` intent is enabled.

## `Package not loaded`

Cause: package config missing, disabled, or unresolved.

Fix:

- Verify file exists under `packages/`.
- Ensure `enabled` is `true`.
- Confirm `package` name is correct.

## Hot reload not triggering

Cause: `dev` mode not active or edits outside watched directories.

Fix:

- Run `arcane dev`.
- Confirm edited file is in configured `directories`.
- Check terminal logs for watcher events.

## MkDocs strict build fails

Cause: nav mismatch or missing referenced file.

Fix:

- Run `mkdocs build --strict` locally.
- Correct bad `nav` path in `mkdocs.yml`.
- Ensure all referenced markdown/images exist.
