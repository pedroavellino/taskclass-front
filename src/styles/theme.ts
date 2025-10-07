import { createGlobalStyle, type DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    bg: "#f3f6ff",      
    card: "#ffffff",    
    text: "#0f172a",   
    muted: "#475569",  
    primary: "#3b5bfd", 
    border: "#e6e8f0", 
    ring: "#3b5bfd", 
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
