# Recipe: Support Panel with Buttons

## Goal

Create a message with buttons to route users to support flows.

## Pattern

Use a command response embed + buttons.

```json
{
  "name": "support",
  "description": "Open support panel",
  "type": "both",
  "response": {
    "type": "embed",
    "title": "Support Panel",
    "description": "Choose an action"
  },
  "buttons": [
    {
      "label": "Open Ticket",
      "style": "primary",
      "customId": "support_ticket",
      "response": "Ticket flow coming soon."
    },
    {
      "label": "Documentation",
      "style": "link",
      "url": "https://ramkrishna-js.github.io/arcane-builder/"
    }
  ]
}
```
