import { buildPool } from "./pools.js";
import { evaluateTriggers } from "./triggers.js";
const FALLBACK_SCENE_ID = "core_matrix_rain";
export function selectScene(ctx, library) {
    // 1. Check triggers
    const forced = evaluateTriggers(ctx.data, ctx.state, ctx.now);
    if (forced) {
        const scene = library.scenes.find((s) => s.id === forced.force);
        if (scene) {
            return {
                scene,
                trigger: forced,
                poolSize: 0,
            };
        }
    }
    // 2. Build the eligible pool
    const pool = buildPool(library, {
        packs: ctx.enabledPacks,
        scenes: ctx.sceneAllowlist,
        exclude: ctx.sceneExclusions,
        events: ctx.enabledProviders,
        data: ctx.data,
    });
    if (pool.length === 0) {
        const fallback = library.scenes.find((s) => s.id === FALLBACK_SCENE_ID) ?? library.scenes[0];
        return { scene: fallback, poolSize: 0 };
    }
    // 3. Deterministic cycle through the pool
    const cycleSeconds = ctx.cycleSeconds ?? 20;
    const index = Math.floor(ctx.now / 1000 / cycleSeconds) % pool.length;
    return { scene: pool[index], poolSize: pool.length };
}
//# sourceMappingURL=select.js.map