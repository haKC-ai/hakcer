/**
 * Auto-decorator — picks a left/right glyph pair for every scene based on
 * its pack and verb, so all 167 scenes get icons without editing scenes.json
 * frame by frame.
 *
 * Resolution order (first match wins):
 *   1. exact scene.id match
 *   2. scene.verb (case-insensitive) match
 *   3. scene.pack match
 *   4. generic default
 *
 * Returns Nerd Font glyphs when caps.nerdFont === true, ASCII otherwise.
 */
import { Scene, FontCaps } from "../types.js";
interface Pair {
    left: {
        nerd: string;
        fallback: string;
    };
    right: {
        nerd: string;
        fallback: string;
    };
}
export declare function decoratorFor(scene: Scene): Pair;
export declare function decorate(text: string, scene: Scene, caps: FontCaps): string;
export {};
//# sourceMappingURL=decorate.d.ts.map