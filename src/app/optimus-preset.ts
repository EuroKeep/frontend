import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';

/**
 * Optimus UI theme: Aura with the colors of the EuroKeep website (website/assets/css/main.css).
 */
export const EuroKeepPreset = definePreset(Aura, {
    semantic: {
        // EU blue (#003399) as primary palette
        primary: {
            50: '#e6ecf7',
            100: '#c2d0ec',
            200: '#97afdd',
            300: '#6688c9',
            400: '#335cb3',
            500: '#003399',
            600: '#002d88',
            700: '#002673',
            800: '#001f5e',
            900: '#00184a',
            950: '#000f30',
        },
        colorScheme: {
            dark: {
                // Dark EU blue is unreadable on dark surfaces, use the website's dark accent instead
                primary: {
                    color: '#8fa8ff',
                    contrastColor: '#0d1020',
                    hoverColor: '#b3c4ff',
                    activeColor: '#c4d1fd',
                },
                // Website dark mode: --bg #0d1020, --bg-alt #121731, --surface #171d3a, --border #262d52
                surface: {
                    0: '#ffffff',
                    50: '#e8eaf4',
                    100: '#d0d4e6',
                    200: '#b4bad3',
                    300: '#a3a9c2',
                    400: '#7d84a3',
                    500: '#5a6075',
                    600: '#3a4170',
                    700: '#262d52',
                    800: '#1d2650',
                    900: '#171d3a',
                    950: '#0d1020',
                },
            },
        },
    },
});
