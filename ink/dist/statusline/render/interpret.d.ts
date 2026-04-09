/**
 * Scene interpreter — the central render component.
 * Takes a scene JSON + render context + library, returns a rendered ANSI string.
 */
import { Scene, SceneLibrary, RenderContext } from "../types.js";
export declare function interpretScene(scene: Scene, ctx: RenderContext, library: SceneLibrary): string;
export declare function composeScene(rendered: string, width: number): string;
//# sourceMappingURL=interpret.d.ts.map