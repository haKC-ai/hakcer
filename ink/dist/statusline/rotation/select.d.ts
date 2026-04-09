/**
 * Scene selector — triggers first, then time-based cycle through the pool.
 */
import { Scene, SceneLibrary, SelectContext } from "../types.js";
export interface SelectResult {
    scene: Scene;
    trigger?: {
        triggerId: string;
        force: string;
        pinnedUntil: number;
    };
    poolSize: number;
}
export declare function selectScene(ctx: SelectContext, library: SceneLibrary): SelectResult;
//# sourceMappingURL=select.d.ts.map