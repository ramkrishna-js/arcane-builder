# Example: Custom Package Workflow

## 1. Define package metadata

Create `arcane.package.json` with name, version, compatibility, and schema.

## 2. Implement entry module

Expose `init`, `getCommands`, and `getEvents` where needed.

## 3. Publish

Publish package artifacts to your registry/CDN flow.

## 4. Consume

Add a `packages/*.json` config in the Arcane bot project and validate.
