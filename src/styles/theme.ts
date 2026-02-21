import { createGlobalStyle, type DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    bg: "#0B1220",
    card: "#111B2E",
    card2: "#0F1A2D",
    inputBg: "#0F1A2D",
    border: "#1F2A44",

    text: "#EAF0FF",
    muted: "#9AA4B2",

    primary: "#4DA3FF",
    danger: "#FF5A5F",

    ring: "#4DA3FF",
  },
  radius: "16px",
};

export const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  input, textarea, select, button { font: inherit; }
`;
