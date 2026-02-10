# Example: Moderation Bot

## Setup

```bash
arcane init mod-bot
cd mod-bot
arcane package add @arcane/moderation
arcane create command moderation/warn
arcane create command moderation/ban
arcane create event guildMemberAdd
```

## Recommended Config

- Define moderation role mapping
- Configure anti-spam thresholds
- Log actions to a dedicated moderation channel
