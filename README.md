<p align="center">
  <h1 align="center">🎨 Styled Stack Card</h1>
  <p align="center">
    A powerful Home Assistant custom card that lets you apply stunning gradient backgrounds and unified styling to an entire stack of cards.
  </p>
</p>

<p align="center">
  <a href="https://github.com/hacs/default">
    <img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge&logo=homeassistant" alt="HACS Badge">
  </a>
  <a href="https://github.com/Mariocoleguilla/styled-stack-card/releases">
    <img src="https://img.shields.io/github/v/release/Mariocoleguilla/styled-stack-card?style=for-the-badge&color=orange" alt="Release">
  </a>
  <a href="https://github.com/Mariocoleguilla/styled-stack-card/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Mariocoleguilla/styled-stack-card?style=for-the-badge&color=blue" alt="License">
  </a>
</p>

---

## 📸 Screenshots & Showcase

<p align="center">
  <img src="https://github.com/user-attachments/assets/de6dfa27-ac8e-4009-b35f-9485692eda87" alt="Styled Stack Card Showcase" width="48%" style="border-radius: 8px; margin: 4px;" />
  <img src="https://github.com/user-attachments/assets/1cd99de6-1a1f-4745-a452-23c3f4ec9a07" alt="Visual Editor Overview" width="48%" style="border-radius: 8px; margin: 4px;" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/db5f1354-2227-4a12-91e1-ef97ff50a933" alt="Presets and Color Controls" width="48%" style="border-radius: 8px; margin: 4px;" />
  <img src="https://github.com/user-attachments/assets/af9e57ce-244d-41a8-b204-2baf70d9679a" alt="Color Picker & Alpha Sliders" width="48%" style="border-radius: 8px; margin: 4px;" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/af17a14c-3181-4256-9bf0-64d389bfbd6b" alt="Clipboard & Tab Controls" width="60%" style="border-radius: 8px; margin: 4px;" />
</p>

---

## 💡 Why Styled Stack Card?

When designing dashboards in Home Assistant, it's common to group several cards together inside a stack container.

Unfortunately, standard stack cards don't have their own `ha-card` background, meaning they can't easily be styled as a single component with gradients or custom themes.

**Styled Stack Card** solves this by providing a real container card with aesthetic custom gradient options and seamless card transparency, while automatically rendering any stack of Lovelace cards inside it.

---

## ✨ Features

- 🌈 **Up to 3-Color Gradients**: Configure custom start, middle (optional), and end colors with custom angle (0° - 360°).
- 🎨 **Native Color Pickers**: Custom aesthetic color pickers with opacity/alpha sliders and live gradient preview.
- 📋 **Clipboard Integration**: Easily copy, cut, and **paste cards directly from your dashboard clipboard**.
- 🛠 **Full Visual Editor**: Tabbed card navigation with quick reordering (move left/right), duplicate, and delete actions.
- 🔮 **Automatic Card Transparency**: Child cards automatically blend into the background gradient without needing a transparent HA theme.
- 🌟 **Built-in Presets**: Quick-select popular themes (Spotify, Warm Lights, Water, Alert).
- 📦 **Supports Any Lovelace Card**: Mushroom, Tile, Entities, Button, ApexCharts, Bubble Card, and custom cards.
- ⚡ **Lightweight & Fast**: Built with Lit & TypeScript for maximum performance.

---

## 🛠 Visual Editor Features

Styled Stack Card includes a full-featured Home Assistant Visual Editor:

### 🎨 Gradient & Preset Configuration
- Choose built-in presets or **Custom Colors**.
- Configure **up to 3 gradient color stops** (Start, Middle with custom position %, and End).
- Per-color opacity/alpha sliders (0–100%) with live visual swatches.
- Adjustable gradient angle (0° to 360°).
- Real-time gradient preview bar inside the editor.

### 📋 Card Management & Clipboard
- **Tab Navigation**: Easily switch between child cards in the editor stack.
- **Paste from Clipboard**: Paste cards previously copied in your Lovelace dashboard with a single click.
- **Card Actions**: Move cards left/right, Copy, Cut, or Delete with toolbar action buttons.
- **Card Picker**: Built-in Home Assistant card picker to add any card directly.

---

## ⚙️ Configuration

### YAML Example

```yaml
type: custom:styled-stack-card
style_config:
  preset: custom                  # Options: custom, spotify, lights, water, alert
  color_start: rgba(29, 185, 84, 0.3)
  color_mid: rgba(100, 50, 200, 0.2)  # Optional 3rd color
  color_mid_pos: 50                 # Position of middle color (1-99%)
  color_end: rgba(30, 30, 30, 0)
  angle: 135                        # Gradient angle in degrees
cards:
  - type: tile
    entity: light.living_room
  - type: tile
    entity: media_player.tv
```

### Options Table

| Option | Type | Default | Description |
|---|---|---|---|
| `cards` | `array` | `[]` | List of Lovelace cards inside the stack |
| `style_config.preset` | `string` | `spotify` | Preset theme (`custom`, `spotify`, `lights`, `water`, `alert`) |
| `style_config.color_start` | `string` | `rgba(128,128,128,0.25)` | Start color (supports `rgb()` / `rgba()`) |
| `style_config.color_mid` | `string` | *Optional* | Optional 3rd middle color stop |
| `style_config.color_mid_pos` | `number` | `50` | Middle color position percentage (1–99%) |
| `style_config.color_end` | `string` | `rgba(30,30,30,0)` | End color (supports `rgb()` / `rgba()`) |
| `style_config.angle` | `number` | `135` | Gradient angle in degrees (0–360°) |

---

## 🚀 Installation

### HACS (recommended)

1. Open **HACS** in Home Assistant.
2. Go to **Frontend** → Click **⋮ → Custom repositories**.
3. Add Repository URL:
   ```
   https://github.com/Mariocoleguilla/styled-stack-card
   ```
   Category:
   ```
   Dashboard
   ```
4. Click **Install** and reload your browser dashboard.

---

### Manual Installation

1. Download `styled-stack-card.js` from the [Latest Release](https://github.com/Mariocoleguilla/styled-stack-card/releases).
2. Copy `styled-stack-card.js` into your `config/www/` folder.
3. Register the resource in **Settings → Dashboards → Resources**:
   ```yaml
   url: /local/styled-stack-card.js
   type: module
   ```

---

## 🧩 Works With Any Card

Compatible with all standard and custom Home Assistant cards:
- **Tile Card** & **Mushroom Cards**
- **Bubble Card** & **custom:button-card**
- **Entities**, **Entity**, **Button**, & **Glance Cards**
- **Gauge**, **History Graph**, & **Markdown Cards**
- **Mini Graph Card** & **ApexCharts**

---

## ❓ Frequently Asked Questions

#### Does it require a transparent Home Assistant theme?
No! Child cards automatically inherit background transparency inside `styled-stack-card`, allowing the gradient to shine through on any default or custom theme while keeping card borders visible.

#### Can I add 3 colors to the gradient?
Yes! In the visual editor under "Colores manuales", click **"Añadir color intermedio"** to enable a 3rd color stop with a position slider.

#### How does the Clipboard function work?
When you copy or cut a card in the editor, or copy a card from your dashboard, click **"Pegar tarjeta del portapapeles"** inside the editor to insert it into the stack instantly.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support the Project

If Styled Stack Card makes your dashboards cleaner or easier to maintain, consider giving the repository a **star** on GitHub!

<p align="center">
  <a href="https://www.paypal.com/donate/?hosted_button_id=C6T54AXECTX9L">
    <img src="https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Donate via PayPal" />
  </a>
</p>
