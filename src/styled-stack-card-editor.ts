import { LitElement, html, css } from 'lit';
import { LovelaceCardConfig, getLovelace } from 'custom-card-helpers';
import { StyledStackCard } from './styled-stack-card';

interface StyledStackConfig extends LovelaceCardConfig {
  cards?: LovelaceCardConfig[];
  style_config?: {
    preset?: string;
    color_start?: string;
    color_end?: string;
    angle?: string | number;
    [key: string]: any;
  };
}

export class StyledStackCardEditor extends LitElement {
  private _config!: StyledStackConfig;
  private _hass: any;
  private _lovelace: any;
  private _addingCard = false;

  static get properties() {
    return {
      hass: { attribute: false },
      lovelace: { attribute: false },
      _config: { state: true },
      _addingCard: { state: true },
    };
  }

  set hass(hass: any) {
    this._hass = hass;
  }

  set lovelace(lovelace: any) {
    this._lovelace = lovelace;
  }

  private get _effectiveLovelace() {
    return this._lovelace ?? getLovelace();
  }

  public setConfig(config: StyledStackConfig) {
    this._config = config ?? ({ type: 'styled-stack-card', cards: [] } as StyledStackConfig);
  }

  private _updateConfig(newConfig: StyledStackConfig) {
    this._config = newConfig;
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _updateStyleConfig(key: string, value: any) {
    if (!this._config) return;

    const currentStyle = this._config.style_config || {};
    const newConfig: StyledStackConfig = {
      ...this._config,
      style_config: {
        ...currentStyle,
        [key]: value,
      },
    };

    this._updateConfig(newConfig);
  }

  private _handlePresetChange(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    this._updateStyleConfig('preset', target.value);
  }

  private _handleTextChange(ev: Event, key: string) {
    const target = ev.target as HTMLInputElement;
    this._updateStyleConfig(key, target.value);
  }

  private _getValidHex(color: string | undefined, fallback: string) {
    if (!color) return fallback;
    return color.startsWith('#') && color.length === 7 ? color : fallback;
  }

  // --- GESTIÓN DE AÑADIDO Y EDICIÓN DE TARJETAS ---

  private async _startAddCard() {
    await StyledStackCard.ensureHaEditorElements();
    this._addingCard = true;
  }

  private _handleCardPicked(ev: CustomEvent) {
    ev.stopPropagation();
    const newCardConfig = ev.detail?.config;

    if (newCardConfig) {
      const cards = [...(this._config.cards || []), newCardConfig];
      this._updateConfig({
        ...this._config,
        cards,
      });
    }

    this._addingCard = false;
  }

  private _deleteCard(index: number) {
    if (!this._config || !this._config.cards) return;
    const cards = [...this._config.cards];
    cards.splice(index, 1);

    this._updateConfig({
      ...this._config,
      cards,
    });
  }

  private _moveCard(index: number, direction: 'up' | 'down') {
    if (!this._config || !this._config.cards) return;
    const cards = [...this._config.cards];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= cards.length) return;

    const [movedCard] = cards.splice(index, 1);
    cards.splice(newIndex, 0, movedCard);

    this._updateConfig({
      ...this._config,
      cards,
    });
  }

  private _handleTypeChange(ev: Event, index: number) {
    if (!this._config || !this._config.cards) return;
    const target = ev.target as HTMLSelectElement;
    const cards = [...this._config.cards];

    cards[index] = {
      ...cards[index],
      type: target.value,
    };

    this._updateConfig({
      ...this._config,
      cards,
    });
  }

  private _handleCardConfigChanged(ev: CustomEvent, index: number) {
    ev.stopPropagation();
    if (!this._config || !this._config.cards) return;

    const cards = [...this._config.cards];
    cards[index] = ev.detail.config;

    this._updateConfig({
      ...this._config,
      cards,
    });
  }

  render() {
    if (!this._config) return html``;

    const style = this._config.style_config || {};
    const preset = style.preset || 'custom';
    const isCustom = preset === 'custom';
    const cards = this._config.cards || [];

    return html`
      <div class="card-config">
        <!-- SECCIÓN 1: ESTILOS Y TEMAS -->
        <div class="section-title">🎨 Configuración Visual</div>

        <div class="select-container">
          <label class="select-label">Tema Visual</label>
          <select .value=${preset} @change=${this._handlePresetChange}>
            <option value="custom">🎨 Colores Manuales</option>
            <option value="spotify">🟢 Spotify</option>
            <option value="lights">🟡 Luces Cálidas</option>
            <option value="water">🔵 Agua / Baño</option>
            <option value="alert">🔴 Alerta</option>
          </select>
        </div>

        ${isCustom
        ? html`
              <div class="custom-colors">
                <div class="field-row">
                  <label class="select-label">Color Superior</label>
                  <div class="input-group">
                    <input
                      type="color"
                      class="color-picker"
                      .value=${this._getValidHex(style.color_start, '#1db954')}
                      @input=${(e: Event) => this._handleTextChange(e, 'color_start')}
                    />
                    <input
                      type="text"
                      class="text-input"
                      placeholder="#1db954 o rgba(29, 185, 84, 0.25)"
                      .value=${style.color_start || ''}
                      @input=${(e: Event) => this._handleTextChange(e, 'color_start')}
                    />
                  </div>
                </div>

                <div class="field-row">
                  <label class="select-label">Color Inferior</label>
                  <div class="input-group">
                    <input
                      type="color"
                      class="color-picker"
                      .value=${this._getValidHex(style.color_end, '#000000')}
                      @input=${(e: Event) => this._handleTextChange(e, 'color_end')}
                    />
                    <input
                      type="text"
                      class="text-input"
                      placeholder="#000000 o rgba(30, 30, 30, 0)"
                      .value=${style.color_end || ''}
                      @input=${(e: Event) => this._handleTextChange(e, 'color_end')}
                    />
                  </div>
                </div>

                <div class="field-row">
                  <label class="select-label">Ángulo del degradado (grados)</label>
                  <input
                    type="number"
                    class="text-input"
                    placeholder="135"
                    .value=${style.angle ?? '135'}
                    @input=${(e: Event) => this._handleTextChange(e, 'angle')}
                  />
                </div>
              </div>
            `
        : ''}

        <hr class="divider" />

        <!-- SECCIÓN 2: GESTOR DE TARJETAS INTERIORES -->
        <div class="section-title">🗂️ Tarjetas Interiores</div>

        <div class="cards-list">
          ${cards.map(
          (cardConfig, index) => html`
              <div class="card-item">
                <div class="card-header">
                  <div class="card-title-group">
                    <span class="card-number">#${index + 1}</span>
                    <select
                      class="type-select"
                      .value=${cardConfig.type || 'entities'}
                      @change=${(e: Event) => this._handleTypeChange(e, index)}
                    >
                      <option value="entities">📋 Entidades (Entities)</option>
                      <option value="button">🔴 Botón (Button)</option>
                      <option value="tile">🔲 Mosaico (Tile)</option>
                      <option value="grid">🧱 Cuadrícula (Grid)</option>
                      <option value="glance">👁️ Vistazo (Glance)</option>
                      <option value="light">💡 Luz (Light)</option>
                      <option value="thermostat">🌡️ Termostato</option>
                      <option value="media-control">🎵 Control de Medios</option>
                      <option value="markdown">📝 Texto Markdown</option>
                    </select>
                  </div>
                  <div class="card-actions">
                    <button
                      class="btn-icon"
                      @click=${() => this._moveCard(index, 'up')}
                      ?disabled=${index === 0}
                    >
                      ⬆️
                    </button>
                    <button
                      class="btn-icon"
                      @click=${() => this._moveCard(index, 'down')}
                      ?disabled=${index === cards.length - 1}
                    >
                      ⬇️
                    </button>
                    <button class="btn-icon btn-danger" @click=${() => this._deleteCard(index)}>
                      🗑️
                    </button>
                  </div>
                </div>

                <!-- Editor nativo de la tarjeta elegida -->
                <div class="card-editor-container">
                  <hui-card-element-editor
                    .hass=${this._hass}
                    .lovelace=${this._effectiveLovelace}
                    .value=${cardConfig}
                    @config-changed=${(e: CustomEvent) =>
              this._handleCardConfigChanged(e, index)}
                  ></hui-card-element-editor>
                </div>
              </div>
            `
        )}
        </div>

        <!-- SECTOR DE INSERCIÓN DIRECTA -->
        ${this._addingCard
        ? html`
              <div class="picker-wrapper">
                <div class="picker-header">
                  <span>Selecciona una tarjeta o pega tu YAML:</span>
                  <button class="btn-cancel" @click=${() => (this._addingCard = false)}>
                    ❌ Cancelar
                  </button>
                </div>
                <hui-card-picker
                  .hass=${this._hass}
                  .lovelace=${this._effectiveLovelace}
                  @config-changed=${this._handleCardPicked}
                ></hui-card-picker>
              </div>
            `
        : html`
              <button class="btn-add" @click=${this._startAddCard}>
                ➕ Añadir tarjeta (Catálogo / Pegar YAML)
              </button>
            `}
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .section-title {
        font-weight: bold;
        font-size: 1.1em;
        color: var(--primary-text-color);
      }
      .select-container,
      .field-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .select-label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      select,
      .text-input {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 10px 12px;
        font-size: 1em;
        width: 100%;
        outline: none;
        box-sizing: border-box;
      }
      .custom-colors {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
        border-left: 4px solid var(--primary-color);
      }
      .input-group {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .color-picker {
        -webkit-appearance: none;
        border: none;
        width: 42px;
        height: 42px;
        border-radius: 4px;
        cursor: pointer;
        padding: 0;
        background: none;
      }
      .color-picker::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      .color-picker::-webkit-color-swatch {
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
      .divider {
        border: none;
        border-top: 1px solid var(--divider-color);
        margin: 8px 0;
      }
      .cards-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .card-item {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        overflow: hidden;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        background: rgba(0, 0, 0, 0.15);
        border-bottom: 1px solid var(--divider-color);
      }
      .card-title-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .card-number {
        font-weight: bold;
        color: var(--primary-color);
      }
      .type-select {
        background: var(--card-background-color, #202020);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 0.85em;
        outline: none;
      }
      .card-actions {
        display: flex;
        gap: 4px;
      }
      .btn-icon {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1em;
        padding: 4px 6px;
        border-radius: 4px;
      }
      .btn-icon:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .btn-icon:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .card-editor-container {
        padding: 12px;
      }
      .btn-add {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        border: none;
        border-radius: 4px;
        padding: 12px;
        font-weight: bold;
        font-size: 0.95em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .btn-add:hover {
        opacity: 0.9;
      }
      .picker-wrapper {
        border: 1px dashed var(--primary-color);
        border-radius: 8px;
        padding: 12px;
        background: var(--secondary-background-color);
      }
      .picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-weight: bold;
      }
      .btn-cancel {
        background: var(--error-color, #db4437);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 0.85em;
      }
    `;
  }
}