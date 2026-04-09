/**
 * Tail-read a Claude Code transcript .jsonl and extract token usage
 * from the most recent {type: "assistant"} entry. Budget < 10ms.
 */
import { openSync, readSync, statSync, closeSync } from "node:fs";
import { TokenUsage } from "../types.js";

const EMPTY: TokenUsage = { input: 0, output: 0, cache_read: 0, cache_write: 0, total: 0 };

export function readTranscriptUsage(path?: string): TokenUsage {
  if (!path) return EMPTY;

  let fd: number | null = null;
  try {
    const stats = statSync(path);
    if (stats.size === 0) return EMPTY;

    fd = openSync(path, "r");
    // Read the last 64KB window — enough for the most recent assistant turn
    const window = Math.min(stats.size, 64 * 1024);
    const buf = Buffer.alloc(window);
    readSync(fd, buf, 0, window, stats.size - window);
    const text = buf.toString("utf8");

    // Walk lines backwards, find the last assistant entry with usage
    const lines = text.split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i]!;
      if (!line.includes('"assistant"') || !line.includes("usage")) continue;
      try {
        const obj = JSON.parse(line);
        const usage = obj?.message?.usage;
        if (!usage) continue;
        const input = Number(usage.input_tokens) || 0;
        const output = Number(usage.output_tokens) || 0;
        const cache_read = Number(usage.cache_read_input_tokens) || 0;
        const cache_write = Number(usage.cache_creation_input_tokens) || 0;
        return {
          input,
          output,
          cache_read,
          cache_write,
          total: input + output + cache_read + cache_write,
        };
      } catch {
        continue;
      }
    }
    return EMPTY;
  } catch {
    return EMPTY;
  } finally {
    if (fd !== null) {
      try {
        closeSync(fd);
      } catch {
        // ignore
      }
    }
  }
}
