// src/index.ts
import { StyledStackCard } from './styled-stack-card';
import { StyledStackCardEditor } from './styled-stack-card-editor';

// Nos aseguramos de registrarlas de forma explícita y segura
if (!customElements.get('styled-stack-card')) {
    customElements.define('styled-stack-card', StyledStackCard);
}

if (!customElements.get('styled-stack-card-editor')) {
    customElements.define('styled-stack-card-editor', StyledStackCardEditor);
}

console.info(
    "%c STYLED-STACK-CARD %c Cargada correctamente ",
    "color: white; background: #1db954; font-weight: 700;",
    "color: black; background: #f3f3f3; font-weight: 700;"
);