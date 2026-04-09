/**
 * Trigger rules — priority-ordered. First match wins.
 * Matched triggers write { triggerId, force, pinnedUntil } to state.json.
 * Subsequent invocations within the pin window replay the forced scene.
 */
import { SessionData, Trigger, PersistentState } from "../types.js";
export declare const TRIGGERS: Trigger[];
export declare function evaluateTriggers(data: SessionData, state: PersistentState, now: number): {
    force: string;
    triggerId: string;
    pinnedUntil: number;
} | null;
//# sourceMappingURL=triggers.d.ts.map