// src/styles/theme.ts
import { createGlobalStyle, type DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    // Paleta clara da "home1"
    bg: "#f3f6ff",      // fundo da página
    card: "#ffffff",    // cartões/containers
    text: "#0f172a",    // texto principal (quase preto)
    muted: "#475569",   // texto secundário
    primary: "#3b5bfd", // botões/destaques (azul arroxeado)
    border: "#e6e8f0",  // bordas suaves
    ring: "#3b5bfd",    // foco/hover
  },
  radius: "16px",
};

export const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }
  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
  }
  input, textarea, select, button { font: inherit; }
`;
