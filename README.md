# Styled Stack Card

<p align="center">

A powerful Home Assistant custom card that lets you apply a single style to an entire stack of cards.

Perfect for creating beautiful dashboards without repeating the same `card_mod` configuration on every individual card.

</p>

<p align="center">

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-41BDF5?logo=homeassistant)
![HACS](https://img.shields.io/badge/HACS-Custom%20Repository-orange)
![License](https://img.shields.io/github/license/Mariocoleguilla/styled-stack-card)

</p>

---

## Why Styled Stack Card?

When designing dashboards in Home Assistant, it's common to group several cards together inside a `vertical-stack` or `horizontal-stack`.

Unfortunately, those stack cards don't have their own `ha-card`, meaning they can't easily be styled as a single component.

As a result, developers often have to repeat the same CSS over every child card using `card-mod`, making configurations verbose and difficult to maintain. :contentReference[oaicite:0]{index=0}

Styled Stack Card solves this by providing a real container card with its own styling, while automatically rendering any stack of Lovelace cards inside it.

---

# Features

- 🎨 Apply one style to an entire stack
- 📦 Supports any Lovelace card
- 📱 Responsive
- 🌙 Theme-aware
- ⚡ Lightweight
- 🧩 Full Visual Editor support
- 🖱 Live preview while editing
- 🔄 Vertical and horizontal layouts
- ❤️ Works with card-mod
- 🚀 Built with Lit and TypeScript

---

# Installation

## HACS (recommended)

1. Open **HACS**
2. Go to **Frontend**
3. Click **⋮ → Custom repositories**
4. Add

```
https://github.com/Mariocoleguilla/styled-stack-card
```

Category:

```
Dashboard
```

Install the card.

Restart Home Assistant.

---

## Manual installation

Download the latest release.

Copy

```
styled-stack-card.js
```

into

```
config/www/
```

Add the resource

```yaml
resources:
  - url: /local/styled-stack-card.js
    type: module
```

Restart Home Assistant.

---

# Basic example

```yaml
type: custom:styled-stack-card
style: |
  ha-card {
    border-radius: 20px;
    padding: 12px;
    background: var(--ha-card-background);
  }

cards:
  - type: entities
    entities:
      - light.kitchen

  - type: button
    entity: switch.coffee
```

---

# Styling

Any CSS that can normally be applied to a `ha-card` can be used.

Example

```yaml
style: |
  ha-card {
    border-radius: 24px;
    padding: 20px;
    background: rgba(0,0,0,.25);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,.1);
  }
```

---

# Works with any card

Examples include

- Entities
- Button
- Tile
- Gauge
- History Graph
- Markdown
- Picture
- Mushroom Cards
- Bubble Card
- ApexCharts
- Mini Graph Card
- Any custom card

---

# Visual Editor

Styled Stack Card includes a native Home Assistant Visual Editor.

You can:

- Add cards
- Remove cards
- Reorder cards
- Edit the container style
- Preview changes instantly

No YAML knowledge is required.

---

# Configuration

| Option | Required | Description |
|----------|----------|-------------|
| `cards` | ✅ | Cards inside the stack |
| `style` | ❌ | CSS applied to the container |
| `mode` | ❌ | Vertical or horizontal layout (if supported) |

---

# Examples

## Rounded container

```yaml
type: custom:styled-stack-card

style: |
  ha-card {
    border-radius: 24px;
    overflow: hidden;
  }

cards:
  ...
```

---

## Glassmorphism

```yaml
style: |
  ha-card {
    background: rgba(255,255,255,.08);
    backdrop-filter: blur(18px);
    border-radius: 18px;
  }
```

---

## Remove all margins

```yaml
style: |
  ha-card {
    margin: 0;
    padding: 0;
  }
```

---

## Dashboard section

```yaml
type: custom:styled-stack-card

style: |
  ha-card {
    padding: 16px;
    border-radius: 18px;
  }

cards:
  - type: heading
    heading: Living Room

  - type: tile
    entity: light.living_room

  - type: tile
    entity: media_player.tv
```

---

# Compatibility

Compatible with

- Home Assistant Dashboard
- card-mod
- Mushroom Cards
- Bubble Card
- Sections Dashboard
- Masonry Dashboard

---

# Frequently Asked Questions

## Does it replace vertical-stack?

No.

It wraps a stack while providing a stylable container.

---

## Does it modify child cards?

No.

Each child card behaves exactly as before.

---

## Can I use card-mod?

Yes.

Styled Stack Card works perfectly alongside card-mod.

---

## Does it affect performance?

The card is extremely lightweight and only adds a minimal wrapper around the child cards.

---

# Roadmap

Future ideas

- Animations
- Collapsible stacks
- Conditional styling
- Presets
- Theme variables editor
- CSS helper UI
- Export/import styles

---

# Contributing

Pull Requests and feature suggestions are always welcome.

If you've found a bug, please open an Issue with:

- Home Assistant version
- Browser
- YAML configuration
- Screenshots

---

# License

MIT License

---

# Author

Mario Coleguilla

GitHub

https://github.com/Mariocoleguilla

---

## ⭐ Support the project

If Styled Stack Card makes your dashboards cleaner or easier to maintain, consider giving the repository a **star** on GitHub.

It helps other Home Assistant users discover the project and motivates future development.

https://www.paypal.com/donate/?hosted_button_id=C6T54AXECTX9L
