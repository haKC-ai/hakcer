/**
 * Glyph/icon registry — scene.icons[] → actual Nerd Font codepoints with
 * ASCII fallback. Must cover every icon id referenced in scenes.json.
 */
import { FontCaps } from "../types.js";
export declare function resolveGlyphs(icons: string[] | undefined, caps: FontCaps): string[];
export declare function injectGlyphs(frame: string, icons: string[] | undefined, caps: FontCaps): string;
//# sourceMappingURL=glyph.d.ts.map