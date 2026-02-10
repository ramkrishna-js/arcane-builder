# Interactions: Embeds, Buttons, Dropdowns

Arcane supports rich responses directly in command JSON.

## Embed + Buttons + Select Menu

```json
{
  "name": "ui",
  "description": "UI test",
  "type": "both",
  "package": null,
  "response": {
    "type": "embed",
    "color": "#22D3EE",
    "title": "Arcane UI",
    "description": "Hello {{user.mention}}",
    "fields": [
      { "name": "Server", "value": "{{guild.name}}", "inline": true }
    ],
    "footer": { "text": "Arcane Builder" },
    "timestamp": true
  },
  "buttons": [
    {
      "label": "Primary",
      "style": "primary",
      "customId": "ui_primary",
      "response": "Primary clicked"
    },
    {
      "label": "Website",
      "style": "link",
      "url": "https://ramkrishna-js.github.io/arcane-builder/"
    }
  ],
  "selectMenus": [
    {
      "customId": "ui_select",
      "placeholder": "Choose",
      "options": [
        { "label": "One", "value": "one" },
        { "label": "Two", "value": "two" }
      ],
      "responses": {
        "one": "You selected one",
        "two": "You selected two"
      }
    }
  ]
}
```

## Notes

- Link buttons require `url` and do not emit component interaction.
- Non-link buttons require `customId`.
- Select menus use `responses` mapping keyed by selected value.
