# Command Workflow

## Create Command

```bash
arcane create command general/hello
```

## Example Command (`both`)

```json
{
  "name": "hello",
  "description": "Say hello",
  "type": "both",
  "package": null,
  "response": {
    "type": "message",
    "content": "Hello {{user.mention}}"
  }
}
```

## Validate and Test

```bash
arcane validate
arcane dev
```

Test both:

- Slash: `/hello`
- Text: `!hello`

## Scale Pattern

Use domain folders:

- `commands/general`
- `commands/moderation`
- `commands/music`
