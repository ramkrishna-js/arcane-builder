# Template Variables

Arcane templates use `{{path.to.value}}` syntax.

## Common Variables

- `{{user.id}}`, `{{user.tag}}`, `{{user.mention}}`
- `{{member.joinedAt}}`, `{{member.roles}}`
- `{{guild.name}}`, `{{guild.memberCount}}`
- `{{channel.name}}`, `{{channel.mention}}`
- `{{bot.tag}}`, `{{bot.uptime}}`

## Example

```json
{
  "description": "Welcome {{user.mention}} to {{guild.name}}"
}
```

## Behavior

- Missing values remain unchanged in output.
- Non-string inputs are returned as-is.
