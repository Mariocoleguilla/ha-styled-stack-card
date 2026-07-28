# 🎨 Styled Stack Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/default)
[![GitHub Release](https://img.shields.io/github/v/release/usuario/styled-stack-card?style=for-the-badge)](https://github.com/usuario/styled-stack-card/releases)
[![License](https://img.shields.io/github/license/usuario/styled-stack-card?style=for-the-badge)](LICENSE)

**Styled Stack Card** es una tarjeta contenedora avanzada para Home Assistant que te permite agrupar múltiples tarjetas secundarias dentro de un contenedor visualmente atractivo con degradados personalizados y temas dinámicos.

Incluye un **editor visual completo en tiempo real** que permite gestionar tarjetas hijas, reordenarlas, copiarlas, cortarlas y pegarlas directamente mediante un portapapeles integrado.

---

## 🌟 Características

- 🎨 **Estilos y Presets Visuales:** Degradados personalizados con control de ángulos ($0^\circ - 360^\circ$) y temas precargados (*Spotify*, *Luces Cálidas*, *Agua / Baño*, *Alerta*).
- 🗂️ **Gestor de Subtarjetas Integrado:** Añade, edita, reordena y elimina tarjetas de forma totalmente gráfica sin tocar YAML.
- 📋 **Portapapeles Interno:** Soporte para copiar, cortar y pegar tarjetas dentro de tus contenedores.
- 🔄 **Selector Nativo de Home Assistant:** Integración directa con `<hui-card-picker>` y `<hui-card-element-editor>`.
- ⚡ **Alto Rendimiento:** Construido en Lit Web Components para una experiencia fluida y ligera.

---

## 📸 Vista Previa

| Editor Visual | Tarjeta Renderizada |
|---|---|
| ![Editor Styled Stack](https://raw.githubusercontent.com/usuario/styled-stack-card/main/docs/editor-preview.png) | ![Preview Styled Stack](https://raw.githubusercontent.com/usuario/styled-stack-card/main/docs/card-preview.png) |

---

## 🚀 Instalación

### Opción 1: A través de HACS (Recomendado)

1. Abre **HACS** en tu instancia de Home Assistant.
2. Haz clic en los tres puntos de la esquina superior derecha y selecciona **Repositorios personalizados**.
3. Añade la URL de este repositorio, selecciona **Tarjeta (Lovelace)** como categoría y pulsa **Añadir**.
4. Busca `Styled Stack Card` e instálalo.
5. Reinicia o recarga la caché del navegador.

### Opción 2: Instalación Manual

1. Descarga el archivo compilado `styled-stack-card.js` desde la sección de [Releases](https://github.com/usuario/styled-stack-card/releases).
2. Sube el archivo a tu directorio de Home Assistant: `/config/www/styled-stack-card.js`.
3. Ve a **Ajustes** $\rightarrow$ **Paneles de control** $\rightarrow$ **Tres puntos (arriba a la derecha)** $\rightarrow$ **Recursos**.
4. Añade un nuevo recurso:
   - **URL:** `/local/styled-stack-card.js`
   - **Tipo de recurso:** `Módulo JavaScript`

---

## 🛠️ Uso y Configuración

Puedes añadir la tarjeta directamente desde la interfaz gráfica de Lovelace buscando **Styled Stack Card**, o configurarla manualmente mediante YAML.

### Ejemplo en YAML

```yaml
type: custom:styled-stack-card
style_config:
  preset: custom
  color_start: '#1db954'
  color_end: '#000000'
  angle: 135
cards:
  - type: tile
    entity: media_player.spotify
    name: Spotify
  - type: grid
    columns: 2
    cards:
      - type: button
        entity: light.salon
        icon: mdi:lightbulb
      - type: button
        entity: switch.altavoces
        icon: mdi:speaker
