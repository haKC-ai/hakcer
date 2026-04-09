/**
 * Git info via execFile, parallelized, 200ms timeout each.
 * Non-git dir → null.
 */
import { execFile } from "node:child_process";
import { GitInfo } from "../types.js";

function run(cwd: string, args: string[], timeoutMs = 200): Promise<string> {
  return new Promise((resolve) => {
    execFile(
      "git",
      args,
      { cwd, timeout: timeoutMs, encoding: "utf8" },
      (err, stdout) => {
        if (err) return resolve("");
        resolve(stdout.toString().trim());
      }
    );
  });
}

export async function readGit(cwd: string): Promise<GitInfo | null> {
  const branchP = run(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const dirtyP = run(cwd, ["status", "--porcelain=v1"]);
  const aheadBehindP = run(cwd, ["rev-list", "--count", "--left-right", "@{u}...HEAD"]);

  const [branch, dirty, aheadBehind] = await Promise.all([branchP, dirtyP, aheadBehindP]);

  if (!branch || branch === "HEAD") return null;

  let ahead = 0;
  let behind = 0;
  if (aheadBehind) {
    const parts = aheadBehind.split(/\s+/);
    if (parts.length === 2) {
      behind = parseInt(parts[0]!, 10) || 0;
      ahead = parseInt(parts[1]!, 10) || 0;
    }
  }

  return {
    branch,
    dirty: dirty.length > 0,
    ahead,
    behind,
  };
}
