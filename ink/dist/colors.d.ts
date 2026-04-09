/**
 * Color utilities for hex-to-ANSI conversion and gradient interpolation.
 */
export interface RGB {
    r: number;
    g: number;
    b: number;
}
export declare function hexToRgb(hex: string): RGB;
export declare function rgbToAnsi(rgb: RGB): string;
export declare function resetAnsi(): string;
export declare function colorize(char: string, hex: string): string;
export declare function lerpColor(a: RGB, b: RGB, t: number): RGB;
export declare function rgbToHex(rgb: RGB): string;
/**
 * Generate a gradient across `steps` positions using the given hex color stops.
 */
export declare function gradient(stops: string[], steps: number): string[];
/**
 * Apply a gradient to a line of text, returning ANSI-colored string.
 */
export declare function applyGradient(text: string, colors: string[]): string;
//# sourceMappingURL=colors.d.ts.map