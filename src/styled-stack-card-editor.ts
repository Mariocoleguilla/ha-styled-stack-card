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

export class StyledStackCardEditor extends LitElement {
  private _config!: StyledStackConfig;

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true }
    };
  }

  public setConfig(config: StyledStackConfig) {
    this._config = config;
  }

  // Manejador unificado y seguro para cualquier cambio (tanto select como ha-textfield)
  private _updateConfig(configValue: string, value: any) {
    if (!this._config) return;

    if (this._config.style_config?.[configValue] === value) return;

    const newConfig: StyledStackConfig = {
      ...this._config,
      style_config: {
        ...this._config.style_config,
        [configValue]: value,
      },
    };

    if (!newConfig.cards) {
      newConfig.cards = [];
    }

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _handleSelectChange(ev: Event) {
    const target = ev.target as HTMLSelectElement;
    this._updateConfig('preset', target.value);
  }

  private _handleTextChange(ev: CustomEvent, configValue: string) {
    // Los ha-textfield de Home Assistant envían el valor en ev.detail.value
    const value = ev.detail?.value ?? (ev.target as any)?.value ?? '';
    this._updateConfig(configValue, value);
  }

  render() {
    if (!this._config) return html``;

    const style = this._config.style_config || {};
    const preset = style.preset || 'custom';

    return html`
      <div class="card-config">
        <div class="select-container">
          <label class="select-label">Tema Visual</label>
          <select 
            .value=${preset}
            @change=${this._handleSelectChange}
          >
            <option value="custom">🎨 Colores Manuales</option>
            <option value="spotify">🟢 Spotify</option>
            <option value="lights">🟡 Luces Cálidas</option>
            <option value="water">🔵 Agua / Baño</option>
            <option value="alert">🔴 Alerta</option>
          </select>
        </div>

        ${preset === 'custom'
        ? html`
              <div class="custom-colors">
                <ha-textfield
                  label="Color Superior (Ej: rgba(29, 185, 84, 0.25))"
                  .value=${style.color_start || ''}
                  @value-changed=${(e: CustomEvent) => this._handleTextChange(e, 'color_start')}
                ></ha-textfield>

                <ha-textfield
                  label="Color Inferior (Ej: rgba(30, 30, 30, 0))"
                  .value=${style.color_end || ''}
                  @value-changed=${(e: CustomEvent) => this._handleTextChange(e, 'color_end')}
                ></ha-textfield>

                <ha-textfield
                  label="Ángulo del degradado (grados)"
                  type="number"
                  .value=${style.angle || '135'}
                  @value-changed=${(e: CustomEvent) => this._handleTextChange(e, 'angle')}
                ></ha-textfield>
              </div>
            `
        : ''}
          
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
      .select-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .select-label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      select {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 12px;
        font-size: 1em;
        width: 100%;
        outline: none;
        cursor: pointer;
      }
      select:focus {
        border-color: var(--primary-color);
      }
      .custom-colors {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-left: 12px;
        border-left: 4px solid var(--primary-color);
      }
      .info-box {
        background: var(--secondary-background-color);
        padding: 12px;
        border-radius: 8px;
        font-size: 0.9em;
      }
    `;
  }
}