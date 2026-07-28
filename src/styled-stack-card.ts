import { LitElement, html, css } from 'lit';
import { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';

interface StyledStackConfig extends LovelaceCardConfig {
  cards?: any[];
  style_config?: {
    preset?: string;
    color_start?: string;
    color_end?: string;
    angle?: string | number;
    [key: string]: any;
  };
}

export class StyledStackCard extends LitElement {
  private _cards: any[];
  private config!: StyledStackConfig;

  static get properties() {
    return {
      hass: { attribute: false },
      config: { state: true },
      _cards: { state: true }
    };
  }

  constructor() {
    super();
    this._cards = [];
  }

  public static async getConfigElement() {
    return document.createElement('styled-stack-card-editor');
  }

  private _hass!: HomeAssistant;

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._cards) {
      this._cards.forEach((card) => {
        card.hass = hass;
      });
    }
  }

  public get hass(): HomeAssistant {
    return this._hass;
  }

  async setConfig(config: StyledStackConfig) {
    this.config = config;
    if (config.cards && Array.isArray(config.cards)) {
      await this._createCards();
    } else {
      this._cards = [];
    }
  }

  private async _createCards() {
    const helpers = await (window as any).loadCardHelpers();

    this._cards = await Promise.all(
      this.config.cards!.map(async (cardConfig: any) => {
        const element = helpers.createCardElement(cardConfig);
        if (this._hass) {
          element.hass = this._hass;
        }
        return element;
      })
    );
  }

  private getGradientStyle() {
    const style = this.config?.style_config || {};

    if (style.preset === 'spotify') return `linear-gradient(135deg, rgba(29, 185, 84, 0.25) 0%, rgba(30, 30, 30, 0) 100%)`;
    if (style.preset === 'lights') return `linear-gradient(135deg, rgba(255, 204, 0, 0.25) 0%, rgba(30, 30, 30, 0) 100%)`;
    if (style.preset === 'water') return `linear-gradient(135deg, rgba(3, 169, 244, 0.25) 0%, rgba(30, 30, 30, 0) 100%)`;
    if (style.preset === 'alert') return `linear-gradient(135deg, rgba(244, 67, 54, 0.25) 0%, rgba(30, 30, 30, 0) 100%)`;

    const start = style.color_start || 'transparent';
    const end = style.color_end || 'transparent';
    const angle = style.angle || 135;

    return `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
  }

  // Configuración por defecto para el buscador de tarjetas
  public static getStubConfig() {
    return {
      style_config: {
        preset: 'spotify'
      },
      cards: []
    };
  }

  render() {
    if (!this.config) return html``;

    if (!this._cards || this._cards.length === 0) {
      return html`
        <ha-card style="background: ${this.getGradientStyle()};">
          <div class="card-content" style="padding: 16px; text-align: center;">
            <p>⚙️ <b>Styled Stack Card:</b> Añade tarjetas en el código YAML o configura las opciones.</p>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card style="background: ${this.getGradientStyle()}; border: none;">
        <div class="card-content">
          ${this._cards}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        overflow: hidden;
        transition: all 0.3s ease-out;
      }
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0;
      }
    `;
  }
}