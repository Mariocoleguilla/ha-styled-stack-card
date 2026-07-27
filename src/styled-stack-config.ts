import { LovelaceCardConfig } from "custom-card-helpers";

// Definimos nuestra propia interfaz que sí acepta 'cards' y 'style_config'
export interface StyledStackConfig extends LovelaceCardConfig {
  cards?: any[];
  style_config?: {
    preset?: string;
    color_start?: string;
    color_end?: string;
    angle?: string | number;
    [key: string]: any;
  };
}