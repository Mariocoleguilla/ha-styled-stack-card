// src/index.ts
import { StyledStackCard } from './styled-stack-card';
import { StyledStackCardEditor } from './styled-stack-card-editor';

// Registrar los custom elements
if (!customElements.get('styled-stack-card')) {
    customElements.define('styled-stack-card', StyledStackCard);
}

if (!customElements.get('styled-stack-card-editor')) {
    customElements.define('styled-stack-card-editor', StyledStackCardEditor);
}

declare global {
    interface Window {
        customCards: Array<{
            type: string;
            name: string;
            preview?: boolean;
            description?: string;
        }>;
    }
}

window.customCards = window.customCards || [];

if (!window.customCards.some(c => c.type === 'styled-stack-card')) {
    window.customCards.push({
        type: 'styled-stack-card', // <--- QUITAMOS 'custom:' AQUÍ
        name: 'Styled Stack Card',
        preview: true,
        description: 'Un contenedor personalizado con degradados y temas visuales para tus tarjetas.'
    });
}

console.info(
    "%c STYLED-STACK-CARD %c Cargada correctamente ",
    "color: white; background: #1db954; font-weight: 700;",
    "color: black; background: #f3f3f3; font-weight: 700;"
);