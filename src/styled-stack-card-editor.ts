import { LitElement, html, css, nothing, CSSResultGroup } from 'lit';
import { LovelaceCardConfig, getLovelace } from 'custom-card-helpers';
import { StyledStackCard } from './styled-stack-card';

const CLIPBOARD_KEY = 'dashboardCardClipboard';

// Iconos MDI
const mdiContentCopy = 'M19,21H8V7H19M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z';
const mdiContentCut =
  'M19,3H14.82C14.4,1.84 13.3,1 12,1A3,3 0 0,0 9,3H4A2,2 0 0,0 2,5V19A2,2 0 0,0 4,21H9A3,3 0 0,0 12,23A3,3 0 0,0 15,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z';
const mdiContentPaste =
  'M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z';
const mdiDelete = 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';
const mdiPlus = 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z';
const mdiChevronLeft =
  'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z';
const mdiChevronRight =
  'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z';

interface StyledStackConfig extends LovelaceCardConfig {
  cards?: LovelaceCardConfig[];
  style_config?: {
    preset?: string;
    color_start?: string;
    color_mid?: string;
    color_mid_pos?: number;
    color_end?: string;
    angle?: string | number;
    [key: string]: any;
  };
}

const PRESET_OPTIONS = [
  { value: 'custom', label: 'Colores manuales' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'lights', label: 'Luces cálidas' },
  { value: 'water', label: 'Agua / Baño' },
  { value: 'alert', label: 'Alerta' },
];

export class StyledStackCardEditor extends LitElement {
  private _config!: StyledStackConfig;
  private _hass: any;
  private _lovelace: any;
  private _selectedCard = 0;

  static get properties() {
    return {
      hass: { attribute: false },
      lovelace: { attribute: false },
      _config: { state: true },
      _selectedCard: { state: true },
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
    const numCards = this._config.cards?.length ?? 0;
    if (this._selectedCard > numCards) {
      this._selectedCard = numCards;
    }
  }

  protected async firstUpdated() {
    if (StyledStackCard && (StyledStackCard as any).ensureHaEditorElements) {
      await (StyledStackCard as any).ensureHaEditorElements();
    }
  }

  private _updateConfig(newConfig: StyledStackConfig) {
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  // --- Helpers de conversión rgba <-> [R,G,B] + alpha ---

  private _parseRgbaString(value: string): { rgb: [number, number, number]; alpha: number } {
    const match = value.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/
    );
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
      return { rgb: [r, g, b], alpha: Math.round(a * 100) };
    }
    return { rgb: [128, 128, 128], alpha: 100 };
  }

  private _rgbToRgbaString(rgb: [number, number, number], alpha: number): string {
    const a = (alpha / 100).toFixed(2);
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
  }

  private _getStyleData() {
    const style = this._config.style_config || {};
    const startParsed = this._parseRgbaString(style.color_start || 'rgba(128,128,128,0.25)');
    const endParsed = this._parseRgbaString(style.color_end || 'rgba(30,30,30,0)');
    const hasMid = style.color_mid !== undefined && style.color_mid !== null;
    const midParsed = hasMid
      ? this._parseRgbaString(style.color_mid!)
      : { rgb: [128, 128, 128] as [number, number, number], alpha: 50 };
    return {
      preset: style.preset || 'custom',
      color_start_rgb: startParsed.rgb,
      color_start_alpha: startParsed.alpha,
      color_end_rgb: endParsed.rgb,
      color_end_alpha: endParsed.alpha,
      has_mid: hasMid,
      color_mid_rgb: midParsed.rgb,
      color_mid_alpha: midParsed.alpha,
      color_mid_pos: style.color_mid_pos ?? 50,
      angle: Number(style.angle ?? 135),
    };
  }

  private _presetSchema() {
    return [
      {
        name: 'preset',
        selector: {
          select: {
            mode: 'dropdown',
            options: PRESET_OPTIONS,
          },
        },
      },
    ];
  }

  private _angleSchema() {
    return [
      {
        name: 'angle',
        selector: { number: { min: 0, max: 360, step: 1, unit_of_measurement: '°' } },
      },
    ];
  }

  private _handlePresetChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const newPreset = ev.detail.value.preset;
    const current = this._config.style_config || {};
    this._updateConfig({
      ...this._config,
      style_config: { ...current, preset: newPreset },
    });
  }

  private _handleAngleChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const newAngle = ev.detail.value.angle;
    const current = this._config.style_config || {};
    this._updateConfig({
      ...this._config,
      style_config: { ...current, angle: newAngle },
    });
  }

  private _handleColorChange(
    field: 'color_start' | 'color_mid' | 'color_end',
    rgb: [number, number, number],
    alpha: number
  ) {
    const current = this._config.style_config || {};
    this._updateConfig({
      ...this._config,
      style_config: {
        ...current,
        [field]: this._rgbToRgbaString(rgb, alpha),
      },
    });
  }

  private _handleColorRgbChanged(ev: CustomEvent, field: 'color_start' | 'color_mid' | 'color_end') {
    ev.stopPropagation();
    const data = this._getStyleData();
    const newRgb = ev.detail.value as [number, number, number];
    const alpha =
      field === 'color_start' ? data.color_start_alpha
      : field === 'color_mid' ? data.color_mid_alpha
      : data.color_end_alpha;
    this._handleColorChange(field, newRgb, alpha);
  }

  private _handleAlphaChanged(ev: Event, field: 'color_start' | 'color_mid' | 'color_end') {
    const input = ev.target as HTMLInputElement;
    const alpha = parseInt(input.value, 10);
    const data = this._getStyleData();
    const rgb =
      field === 'color_start' ? data.color_start_rgb
      : field === 'color_mid' ? data.color_mid_rgb
      : data.color_end_rgb;
    this._handleColorChange(field, rgb, alpha);
  }

  private _handleMidPosChanged(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const pos = parseInt(input.value, 10);
    const current = this._config.style_config || {};
    this._updateConfig({
      ...this._config,
      style_config: { ...current, color_mid_pos: pos },
    });
  }

  private _toggleMidColor() {
    const current = this._config.style_config || {};
    const hasMid = current.color_mid !== undefined;
    if (hasMid) {
      // Eliminar color_mid y color_mid_pos
      const { color_mid, color_mid_pos, ...rest } = current as any;
      void color_mid; void color_mid_pos;
      this._updateConfig({ ...this._config, style_config: rest });
    } else {
      // Añadir con valor por defecto
      this._updateConfig({
        ...this._config,
        style_config: {
          ...current,
          color_mid: 'rgba(128, 128, 128, 0.15)',
          color_mid_pos: 50,
        },
      });
    }
  }

  private _computePresetLabel = (schema: { name: string }) =>
    schema.name === 'preset' ? 'Tema visual' : schema.name;

  private _computeAngleLabel = (schema: { name: string }) =>
    schema.name === 'angle' ? 'Ángulo del degradado' : schema.name;

  private _renderColorRow(
    label: string,
    field: 'color_start' | 'color_mid' | 'color_end',
    rgb: [number, number, number],
    alpha: number,
    opts?: { removable?: boolean; midPos?: number }
  ) {
    const solidColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const previewColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${(alpha / 100).toFixed(2)})`;
    const alphaTrack = `linear-gradient(to right, transparent, ${solidColor})`;

    return html`
      <div class="color-row">
        <div class="color-row-header">
          <span class="color-row-label">${label}</span>
          <div class="color-row-header-right">
            ${opts?.removable ? html`
              <button class="btn-remove-mid" @click=${this._toggleMidColor} title="Eliminar color medio">
                ✕
              </button>
            ` : nothing}
            <div class="color-swatch-wrap">
              <div class="checker-bg"></div>
              <div class="color-swatch" style="background:${previewColor}"></div>
            </div>
          </div>
        </div>
        <div class="color-row-body">
          <ha-selector
            .hass=${this._hass}
            .selector=${{ color_rgb: {} }}
            .value=${rgb}
            @value-changed=${(e: CustomEvent) => this._handleColorRgbChanged(e, field)}
          ></ha-selector>
          <div class="alpha-row">
            <span class="alpha-label">Opacidad</span>
            <div class="alpha-slider-wrap">
              <div class="alpha-track" style="--alpha-gradient:${alphaTrack}"></div>
              <input
                type="range"
                class="alpha-slider"
                min="0"
                max="100"
                step="1"
                .value=${String(alpha)}
                @input=${(e: Event) => this._handleAlphaChanged(e, field)}
                @change=${(e: Event) => this._handleAlphaChanged(e, field)}
              />
            </div>
            <span class="alpha-value">${alpha}%</span>
          </div>
          ${opts?.midPos !== undefined ? html`
            <div class="alpha-row">
              <span class="alpha-label">Posición</span>
              <div class="alpha-slider-wrap">
                <div class="alpha-track" style="--alpha-gradient:linear-gradient(to right, var(--divider-color), var(--primary-color))"></div>
                <input
                  type="range"
                  class="alpha-slider"
                  min="1"
                  max="99"
                  step="1"
                  .value=${String(opts.midPos)}
                  @input=${this._handleMidPosChanged}
                  @change=${this._handleMidPosChanged}
                />
              </div>
              <span class="alpha-value">${opts.midPos}%</span>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _handleSelectedCard(ev: CustomEvent) {
    this._selectedCard = parseInt(ev.detail.name, 10);
  }

  private _handleCardPicked(ev: CustomEvent) {
    ev.stopPropagation();
    const newCardConfig = ev.detail?.config;
    if (!newCardConfig) return;
    const cards = [...(this._config.cards || []), newCardConfig];
    this._updateConfig({ ...this._config, cards });
    this._selectedCard = cards.length - 1;
  }

  private _handleCardConfigChanged(ev: CustomEvent) {
    ev.stopPropagation();
    if (!this._config.cards) return;
    const cards = [...this._config.cards];
    cards[this._selectedCard] = ev.detail.config;
    this._updateConfig({ ...this._config, cards });
  }

  // --- PORTAPAPELES INTERNO ---

  private _getClipboardCard(): LovelaceCardConfig | null {
    try {
      const data = sessionStorage.getItem(CLIPBOARD_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private _copyCardToClipboard(card: LovelaceCardConfig) {
    sessionStorage.setItem(CLIPBOARD_KEY, JSON.stringify(card));
    this._showToast(this._hass?.localize?.('ui.common.copied') ?? 'Copiado');
    this.requestUpdate();
  }

  private _handlePasteCard() {
    const clipboardCard = this._getClipboardCard();
    if (!clipboardCard) return;
    const cards = [...(this._config.cards || []), clipboardCard];
    this._updateConfig({ ...this._config, cards });
    this._selectedCard = cards.length - 1;
    this._showToast(this._hass?.localize?.('ui.common.pasted') ?? 'Pegado');
  }

  private _showToast(message: string) {
    this.dispatchEvent(
      new CustomEvent('hass-notification', {
        detail: { message },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleCopyCard() {
    if (!this._config.cards?.[this._selectedCard]) return;
    this._copyCardToClipboard(
      JSON.parse(JSON.stringify(this._config.cards[this._selectedCard]))
    );
  }

  private _handleCutCard() {
    if (!this._config.cards) return;
    this._handleCopyCard();
    this._handleDeleteCard();
  }

  private _handleDeleteCard() {
    if (!this._config.cards) return;
    const cards = [...this._config.cards];
    cards.splice(this._selectedCard, 1);
    this._updateConfig({ ...this._config, cards });
    this._selectedCard = Math.max(0, this._selectedCard - 1);
  }

  private _handleMove(direction: number) {
    if (!this._config.cards) return;
    const target = this._selectedCard + direction;
    if (target < 0 || target >= this._config.cards.length) return;
    const cards = [...this._config.cards];
    const [card] = cards.splice(this._selectedCard, 1);
    cards.splice(target, 0, card);
    this._updateConfig({ ...this._config, cards });
    this._selectedCard = target;
  }

  render() {
    if (!this._config || !this._hass) return nothing;

    const data = this._getStyleData();
    const preset = data.preset;
    const cards = this._config.cards || [];
    const selected = this._selectedCard;
    const numCards = cards.length;
    const isAdding = selected >= numCards;
    const hasClipboard = this._getClipboardCard() !== null;

    const gradientPreview = preset === 'custom'
      ? data.has_mid
        ? `linear-gradient(${data.angle}deg, ${this._rgbToRgbaString(data.color_start_rgb, data.color_start_alpha)} 0%, ${this._rgbToRgbaString(data.color_mid_rgb, data.color_mid_alpha)} ${data.color_mid_pos}%, ${this._rgbToRgbaString(data.color_end_rgb, data.color_end_alpha)} 100%)`
        : `linear-gradient(${data.angle}deg, ${this._rgbToRgbaString(data.color_start_rgb, data.color_start_alpha)} 0%, ${this._rgbToRgbaString(data.color_end_rgb, data.color_end_alpha)} 100%)`
      : '';

    return html`
      <div class="card-config">

        <!-- SELECTOR DE PRESET -->
        <ha-form
          .hass=${this._hass}
          .data=${{ preset }}
          .schema=${this._presetSchema()}
          .computeLabel=${this._computePresetLabel}
          @value-changed=${this._handlePresetChanged}
        ></ha-form>

        <!-- SECCIÓN DE COLORES MANUALES -->
        ${preset === 'custom' ? html`
          <div class="gradient-section">

            <div class="gradient-preview-wrap">
              <div class="gradient-preview" style="background:${gradientPreview}"></div>
              <div class="gradient-preview-label">Vista previa del degradado</div>
            </div>

            ${this._renderColorRow('Color superior', 'color_start', data.color_start_rgb, data.color_start_alpha)}

            <!-- Color medio (opcional) -->
            ${data.has_mid
              ? this._renderColorRow('Color medio', 'color_mid', data.color_mid_rgb, data.color_mid_alpha, { removable: true, midPos: data.color_mid_pos })
              : html`
                <button class="btn-add-mid" @click=${this._toggleMidColor}>
                  <span class="btn-add-mid-icon">+</span>
                  Añadir color intermedio
                </button>
              `
            }

            ${this._renderColorRow('Color inferior', 'color_end', data.color_end_rgb, data.color_end_alpha)}

            <ha-form
              .hass=${this._hass}
              .data=${{ angle: data.angle }}
              .schema=${this._angleSchema()}
              .computeLabel=${this._computeAngleLabel}
              @value-changed=${this._handleAngleChanged}
            ></ha-form>
          </div>
        ` : nothing}

        <!-- BARRA DE PESTAÑAS Y NAVEGACIÓN -->
        <div class="toolbar">
          <ha-tab-group .active=${String(selected)} @tab-changed=${this._handleSelectedCard}>
            ${cards.map(
              (_card, i) => html`
                <ha-tab-group-tab .active=${selected === i} .name=${String(i)}>
                  ${i + 1}
                </ha-tab-group-tab>
              `
            )}
            <ha-tab-group-tab .active=${isAdding} .name=${String(numCards)}>
              <ha-icon .path=${mdiPlus}></ha-icon>
            </ha-tab-group-tab>
          </ha-tab-group>
        </div>

        <!-- CONTENIDO DEL EDITOR -->
        ${isAdding
          ? html`
              <div id="editor">
                ${hasClipboard
                  ? html`
                      <div class="paste-bar">
                        <button class="btn-paste" @click=${this._handlePasteCard}>
                          <ha-icon .path=${mdiContentPaste}></ha-icon>
                          Pegar tarjeta del portapapeles
                        </button>
                      </div>
                    `
                  : nothing}
                <hui-card-picker
                  .hass=${this._hass}
                  .lovelace=${this._effectiveLovelace}
                  @config-changed=${this._handleCardPicked}
                ></hui-card-picker>
              </div>
            `
          : numCards > 0
            ? html`
                <div id="card-options">
                  <ha-icon-button
                    .path=${mdiChevronLeft}
                    .label=${'Mover a la izquierda'}
                    .disabled=${selected === 0}
                    @click=${() => this._handleMove(-1)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiChevronRight}
                    .label=${'Mover a la derecha'}
                    .disabled=${selected >= numCards - 1}
                    @click=${() => this._handleMove(1)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiContentCopy}
                    .label=${this._hass.localize?.('ui.common.copy') ?? 'Copiar'}
                    @click=${this._handleCopyCard}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiContentCut}
                    .label=${this._hass.localize?.('ui.common.cut') ?? 'Cortar'}
                    @click=${this._handleCutCard}
                  ></ha-icon-button>
                  <ha-icon-button
                    .path=${mdiDelete}
                    .label=${this._hass.localize?.('ui.common.delete') ?? 'Eliminar'}
                    @click=${this._handleDeleteCard}
                  ></ha-icon-button>
                </div>

                <div id="editor">
                  <hui-card-element-editor
                    .hass=${this._hass}
                    .lovelace=${this._effectiveLovelace}
                    .value=${cards[selected]}
                    @config-changed=${this._handleCardConfigChanged}
                  ></hui-card-element-editor>
                </div>
              `
            : nothing}
      </div>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      css`
        .card-config {
          overflow: auto;
        }

        ha-form {
          display: block;
        }

        /* ── Sección de colores manuales ── */
        .gradient-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 2px;
          margin-bottom: 16px;
        }

        /* Barra de preview del degradado */
        .gradient-preview-wrap {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--divider-color);
        }
        .gradient-preview {
          height: 56px;
          width: 100%;
          transition: background 0.35s ease;
        }
        .gradient-preview-label {
          font-size: 0.72em;
          color: var(--secondary-text-color);
          text-align: center;
          padding: 4px 0;
          background: var(--secondary-background-color);
          letter-spacing: 0.03em;
        }

        /* ── Fila de color ── */
        .color-row {
          background: var(--secondary-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 10px;
          overflow: hidden;
        }
        .color-row-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px 8px;
          border-bottom: 1px solid var(--divider-color);
        }
        .color-row-label {
          font-size: 0.85em;
          font-weight: 600;
          color: var(--primary-text-color);
          letter-spacing: 0.02em;
        }
        .color-row-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* Botón quitar color medio */
        .btn-remove-mid {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--error-color, #f44336);
          background: transparent;
          color: var(--error-color, #f44336);
          font-size: 0.8em;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .btn-remove-mid:hover {
          background: var(--error-color, #f44336);
          color: #fff;
        }
        /* Botón añadir color intermedio */
        .btn-add-mid {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          background: transparent;
          border: 1.5px dashed var(--divider-color);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--secondary-text-color);
          font-size: 0.85em;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        .btn-add-mid:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          background: color-mix(in srgb, var(--primary-color) 6%, transparent);
        }
        .btn-add-mid-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid currentColor;
          font-size: 1.1em;
          line-height: 1;
          flex-shrink: 0;
        }

        /* Swatch circular con patrón de ajedrez para transparencia */
        .color-swatch-wrap {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--divider-color);
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .checker-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(45deg, #aaa 25%, transparent 25%),
            linear-gradient(-45deg, #aaa 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #aaa 75%),
            linear-gradient(-45deg, transparent 75%, #aaa 75%);
          background-color: #fff;
          background-size: 7px 7px;
          background-position: 0 0, 0 3.5px, 3.5px -3.5px, -3.5px 0;
        }
        .color-swatch {
          position: absolute;
          inset: 0;
          transition: background 0.2s ease;
        }

        .color-row-body {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        ha-selector {
          display: block;
        }

        /* ── Slider de opacidad ── */
        .alpha-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .alpha-label {
          font-size: 0.78em;
          color: var(--secondary-text-color);
          white-space: nowrap;
          min-width: 54px;
        }
        .alpha-slider-wrap {
          position: relative;
          flex: 1;
          height: 20px;
          display: flex;
          align-items: center;
        }
        /* Pista: checker base + overlay con el gradiente de color */
        .alpha-track {
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          border-radius: 4px;
          pointer-events: none;
          /* checker base */
          background-image:
            linear-gradient(45deg, #bbb 25%, transparent 25%),
            linear-gradient(-45deg, #bbb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #bbb 75%),
            linear-gradient(-45deg, transparent 75%, #bbb 75%),
            var(--alpha-gradient, linear-gradient(to right, transparent, grey));
          background-color: #fff;
          background-size: 8px 8px, 8px 8px, 8px 8px, 8px 8px, 100% 100%;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0, 0 0;
        }
        .alpha-slider {
          position: relative;
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          z-index: 1;
        }
        .alpha-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--card-background-color, #fff);
          border: 2.5px solid var(--primary-color);
          box-shadow: 0 1px 5px rgba(0,0,0,0.28);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .alpha-slider::-webkit-slider-thumb:hover {
          transform: scale(1.18);
          box-shadow: 0 2px 9px rgba(0,0,0,0.32);
        }
        .alpha-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--card-background-color, #fff);
          border: 2.5px solid var(--primary-color);
          box-shadow: 0 1px 5px rgba(0,0,0,0.28);
          cursor: pointer;
        }
        .alpha-value {
          font-size: 0.8em;
          font-weight: 600;
          color: var(--primary-text-color);
          min-width: 34px;
          text-align: right;
        }

        /* ── Toolbar y editor de tarjetas ── */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          margin-top: 4px;
        }
        ha-tab-group {
          flex-grow: 1;
          min-width: 0;
          --ha-tab-track-color: var(--card-background-color);
        }
        #card-options {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          gap: 4px;
          margin-bottom: 8px;
        }
        #editor {
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          padding: 12px;
          background: var(--secondary-background-color);
        }
        .paste-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        .btn-paste {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-color);
          color: var(--text-primary-color, #fff);
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-weight: bold;
          cursor: pointer;
        }
        .btn-paste:hover {
          opacity: 0.9;
        }
        @media (max-width: 450px) {
          #editor {
            margin: 0 -12px;
          }
        }
      `,
    ];
  }
}
