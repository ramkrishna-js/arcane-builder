# @arcane/music

High-level music features for Arcane bots.

## Typical Features

- Search and queue tracks
- Voice connection management
- Queue controls (pause/resume/skip/loop)
- Platform toggles (YouTube/Spotify/SoundCloud)

## Example Config

```json
{
  "package": "@arcane/music",
  "version": "latest",
  "enabled": true,
  "config": {
    "player": {
      "maxQueueSize": 100,
      "defaultVolume": 50
    }
  }
}
```
