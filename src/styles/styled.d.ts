import 'styled-components';

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