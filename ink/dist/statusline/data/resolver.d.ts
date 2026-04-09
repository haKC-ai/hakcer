/**
 * Dotted-path data resolver for scene `data_map` templates.
 * Scene says `"data_map": {"title": "events.seckc.next.title"}`
 * We walk `tree.events.seckc.next.title` and substitute into `{title}`.
 */
import { ResolvedData, SessionData } from "../types.js";
export declare function resolveDataPath(tree: ResolvedData, path: string): string;
export declare function applyDataMap(frame: string, dataMap: Record<string, string> | undefined, tree: ResolvedData): string;
export declare function buildResolvedData(session: SessionData, tick: number): ResolvedData;
//# sourceMappingURL=resolver.d.ts.map