import { LitElement, html, css } from 'lit';
import { LovelaceCardConfig } from 'custom-card-helpers';

interface StyledStackConfig extends LovelaceCardConfig {
  cards?: any[];
  style_config?: {
    preset?: string;
    color_start?: string;
    color_end?: string;
    angle?: number;
    [key: string]: any;
  };
}

export class StyledStackCardEditor extends LitElement {
  private _config!: StyledStackConfig;

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true }
    };
  }

  public setConfig(config: StyledStackConfig) {
    this._config = config ?? ({ type: 'custom:styled-stack-card' } as StyledStackConfig);
  }

  // Evento único gestionado por ha-form
  private _valueChanged(ev: CustomEvent) {
    if (!this._config) return;

    // ev.detail.value ya nos devuelve un objeto limpio con todos los campos
    const formData = ev.detail.value;

    const newConfig: StyledStackConfig = {
      ...this._config,
      style_config: {
        ...this._config.style_config,
        ...formData,
      },
    };

    if (!newConfig.cards) {
      newConfig.cards = [];
    }

    this._config = newConfig;

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // Traduce los nombres técnicos a etiquetas bonitas en la UI
  private _computeLabel = (schema: any) => {
    const labels: Record<string, string> = {
      preset: 'Tema Visual',
      color_start: 'Color Superior',
      color_end: 'Color Inferior',
      angle: 'Ángulo del degradado (º)',
    };
    return labels[schema.name] || schema.name;
  };

  render() {
    if (!this._config) return html``;

    const style = this._config.style_config || {};
    const preset = style.preset || 'custom';

    // 1. Alimentamos el formulario con los datos actuales
    // (Usamos valores HEX por defecto para el selector nativo de color)
    const data = {
      preset: preset,
      color_start: style.color_start || '#1db954',
      color_end: style.color_end || '#000000',
      angle: style.angle !== undefined ? style.angle : 135,
    };

    // 2. Definimos el esquema visual: Le decimos a HA qué controles pintar
    const schema = [
      {
        name: 'preset',
        selector: {
          select: {
            options: [
              { value: 'custom', label: '🎨 Colores Manuales' },
              { value: 'spotify', label: '🟢 Spotify' },
              { value: 'lights', label: '🟡 Luces Cálidas' },
              { value: 'water', label: '🔵 Agua / Baño' },
              { value: 'alert', label: '🔴 Alerta' },
            ],
            mode: 'dropdown'
          }
        }
      },
      // Insertamos los controles nativos solo si es 'custom'
      ...(preset === 'custom'
        ? [
          {
            name: 'color_start',
            selector: { text: { type: 'color' } }, // Despliega el selector de color nativo del SO
          },
          {
            name: 'color_end',
            selector: { text: { type: 'color' } }, // Despliega el selector de color nativo del SO
          },
          {
            name: 'angle',
            selector: { number: { min: 0, max: 360, mode: 'slider' } }, // ¡Un slider nativo de HA!
          },
        ]
        : [])
    ];

    return html`
      <div class="card-config">
        <!-- El todopoderoso ha-form oficial -->
        <ha-form
          .data=${data}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
        
        <div class="info-box">
          <p>💡 <b>Nota:</b> Usa el editor de código (YAML) de la parte inferior para añadir o modificar las tarjetas que irán dentro de este contenedor.</p>
        </div>
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
      .info-box {
        background: var(--secondary-background-color);
        padding: 12px;
        border-radius: 8px;
        font-size: 0.9em;
        margin-top: 8px;
      }
    `;
  }
}