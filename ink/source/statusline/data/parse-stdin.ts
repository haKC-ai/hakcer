/**
 * Read Claude Code's stdin JSON payload with a strict timeout.
 * Claude Code pipes {session_id, model, workspace, transcript_path, ...} on every turn.
 */
import { StdinPayload } from "../types.js";

export async function readStdin(timeoutMs = 50): Promise<StdinPayload> {
  if (process.stdin.isTTY) return {};

  return new Promise((resolve) => {
    let data = "";
    let done = false;

    const finish = (payload: StdinPayload) => {
      if (done) return;
      done = true;
      resolve(payload);
    };

    const timer = setTimeout(() => finish({}), timeoutMs);

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      clearTimeout(timer);
      if (!data.trim()) return finish({});
      try {
        finish(JSON.parse(data) as StdinPayload);
      } catch {
        finish({});
      }
    });
    process.stdin.on("error", () => {
      clearTimeout(timer);
      finish({});
    });
  });
}
