import 'styled-components';

// Extenda a interface DefaultTheme
declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            bg: string;
            card: string;
            text: string;
            muted: string;
            primary: string;
            border: string;
            ring: string;
        };
        radius: string;
    }
}