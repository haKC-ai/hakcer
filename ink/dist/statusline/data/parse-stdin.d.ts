/**
 * Read Claude Code's stdin JSON payload with a strict timeout.
 * Claude Code pipes {session_id, model, workspace, transcript_path, ...} on every turn.
 */
import { StdinPayload } from "../types.js";
export declare function readStdin(timeoutMs?: number): Promise<StdinPayload>;
//# sourceMappingURL=parse-stdin.d.ts.map