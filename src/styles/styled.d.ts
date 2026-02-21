import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      card: string;
      card2: string;
      inputBg: string;
      text: string;
      muted: string;
      primary: string;
      danger: string;
      border: string;
      ring: string;
    };
    radius: string;
  }
}
