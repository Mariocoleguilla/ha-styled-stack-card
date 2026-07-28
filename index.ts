// src/index.ts
import './styled-stack-card';
import './styled-stack-card-editor';

// REGISTRO PARA EL BUSCADOR DE TARJETAS DE HOME ASSISTANT
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'custom:styled-stack-card',
  name: 'Styled Stack Card',
  preview: true, // Permite ver una previsualización si está soportada
  description: 'Un contenedor personalizado con degradados y temas visuales para tus tarjetas.',
  documentationURL: 'https://github.com/tu-usuario/ha-styled-stack-card' // Opcional: enlace a tu repo
});

console.info(
  "%c STYLED-STACK-CARD %c Cargada correctamente ",
  "color: white; background: #1db954; font-weight: 700;",
  "color: black; background: #f3f3f3; font-weight: 700;"
);