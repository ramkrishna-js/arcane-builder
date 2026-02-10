# First Bot

This walkthrough creates a structured bot with slash + text command support.

## 1. Initialize

```bash
arcane init first-bot
cd first-bot
```

## 2. Environment

```bash
cp .env.example .env
```

Set token and client ID in `.env`.

## 3. Create Command and Event

```bash
arcane create command general/hello
arcane create event ready
```

## 4. Validate

```bash
arcane validate --strict
```

## 5. Run

```bash
arcane dev
```

## 6. Test

- Slash: `/hello`
- Text: `!hello`

If slash commands delay, set `settings.devGuild` temporarily.
