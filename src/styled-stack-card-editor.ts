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
    // Aseguramos la existencia de elementos web necesarios para la edición
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

  private _styleSchema(preset: string) {
    const schema: any[] = [
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

    if (preset === 'custom') {
      schema.push(
        { name: 'color_start', selector: { text: {} } },
        { name: 'color_end', selector: { text: {} } },
        {
          name: 'angle',
          selector: { number: { min: 0, max: 360, step: 1, unit_of_measurement: '°' } },
        }
      );
    }

    return schema;
  }

  private _styleFormData() {
    const style = this._config.style_config || {};
    return {
      preset: style.preset || 'custom',
      color_start: style.color_start || '',
      color_end: style.color_end || '',
      angle: style.angle ?? 135,
    };
  }

  private _handleStyleChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const value = ev.detail.value;
    this._updateConfig({
      ...this._config,
      style_config: {
        preset: value.preset,
        ...(value.preset === 'custom'
          ? {
            color_start: value.color_start,
            color_end: value.color_end,
            angle: value.angle,
          }
          : {}),
      },
    });
  }

  private _computeStyleLabel = (schema: { name: string }) => {
    const labels: Record<string, string> = {
      preset: 'Tema visual',
      color_start: 'Color superior',
      color_end: 'Color inferior',
      angle: 'Ángulo del degradado',
    };
    return labels[schema.name] || schema.name;
  };

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

    const style = this._config.style_config || {};
    const preset = style.preset || 'custom';
    const cards = this._config.cards || [];
    const selected = this._selectedCard;
    const numCards = cards.length;
    const isAdding = selected >= numCards;
    const hasClipboard = this._getClipboardCard() !== null;

    return html`
      <div class="card-config">
        <!-- FORMULARIO DE ESTILOS Y TEMAS -->
        <ha-form
          .hass=${this._hass}
          .data=${this._styleFormData()}
          .schema=${this._styleSchema(preset)}
          .computeLabel=${this._computeStyleLabel}
          @value-changed=${this._handleStyleChanged}
        ></ha-form>

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

        <!-- CONTENIDO DEL EDITOR SEGÚN ESTADO DE NAVEGACIÓN -->
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
                <!-- BOTONES DE ACCIÓN PARA LA TARJETA SELECCIONADA -->
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

                <!-- EDITOR DE LA TARJETA SELECCIONADA -->
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
          margin-bottom: 16px;
        }
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
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