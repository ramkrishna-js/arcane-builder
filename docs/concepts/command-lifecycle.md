# Command Lifecycle

## Definition

Command JSON is loaded from `commands/**/*.json` and validated.

## Registration

Commands with `type: slash` or `type: both` are synced as slash commands.

## Execution

- Slash invocation -> `interactionCreate`
- Text invocation -> `messageCreate` with configured prefix

## Response Assembly

Arcane builds payloads from command response config:

- plain content
- embed payload
- buttons
- dropdown/select menus

Template placeholders are resolved at runtime (`{{user.mention}}`, `{{guild.name}}`, etc.).
