/**
 * Pool builder — filter the scene library down to what's eligible for rotation.
 */
import { Scene, SceneLibrary, PoolOpts } from "../types.js";

const HIDDEN_SCENES = new Set(["konami_winner"]);
const TRIGGER_ONLY = new Set(["core_kernel_panic", "core_buffer_overflow", "core_msf"]);

export function buildPool(library: SceneLibrary, opts: PoolOpts): Scene[] {
  let pool = library.scenes.slice();

  // Drop hidden scenes (only reachable via easter eggs)
  pool = pool.filter((s) => !HIDDEN_SCENES.has(s.id));

  // Pack filter
  if (opts.packs && opts.packs.length > 0 && !opts.packs.includes("all")) {
    pool = pool.filter((s) => opts.packs!.includes(s.pack));
  }

  // Scene allowlist
  if (opts.scenes && opts.scenes.length > 0) {
    pool = pool.filter((s) => opts.scenes!.includes(s.id));
  }

  // Exclude list
  if (opts.exclude && opts.exclude.length > 0) {
    pool = pool.filter((s) => !opts.exclude!.includes(s.id));
  }

  // Event-triggered scenes only in pool if the provider is enabled AND condition met
  pool = pool.filter((s) => {
    if (s.id.startsWith("events_seckc_")) {
      if (!opts.events?.includes("seckc")) return false;
      const ev = opts.data?.events?.seckc?.next;
      if (!ev) return false;
      if (s.id === "events_seckc_today") return ev.days_until === 0;
      if (s.id === "events_seckc_upcoming") return ev.days_until > 0 && ev.days_until <= 7;
    }
    // Trigger-only scenes are not in normal rotation
    if (TRIGGER_ONLY.has(s.id)) return false;
    return true;
  });

  return pool;
}
