/**
 * Theme configurations for haKCer banner effects.
 * Each theme defines color palettes applied to terminal effects.
 */
export interface ThemeColors {
    primary: [string, string, string];
    accent: [string, string];
    error: [string];
    gradient_stops: [string, string, string];
    beam_colors: [string, string];
}
export interface Theme {
    name: string;
    description: string;
    colors: ThemeColors;
}
export declare const THEMES: Record<string, Theme>;
export declare function getTheme(name?: string): Theme;
export declare function setTheme(name: string): void;
export declare function getCurrentTheme(): string;
export declare function listThemes(): string[];
//# sourceMappingURL=themes.d.ts.map