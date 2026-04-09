import { PaletteDef, SceneLibrary } from "../types.js";
export interface PaintFns {
    fg: (s: string) => string;
    accent: (s: string) => string;
    gradient: (s: string) => string;
    bold: (s: string) => string;
    dim: (s: string) => string;
}
export declare function getPalette(id: string, library: SceneLibrary): PaletteDef;
export declare function normalizeHex(hex: string): string;
export declare function buildPaintFns(palette: PaletteDef): PaintFns;
export declare function gradientLine(text: string, stops: string[]): string;
export declare function stripAnsi(s: string): string;
//# sourceMappingURL=palette.d.ts.map