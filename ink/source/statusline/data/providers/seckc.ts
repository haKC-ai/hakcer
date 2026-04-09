/**
 * SecKC event provider — scrapes seckc.org Squarespace upcoming events JSON.
 *
 * Cache at ~/.cache/hakcer-statusline/events.json with a 6-hour TTL.
 * Refreshes happen in a detached background child process so the render
 * hot path never blocks on the network.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { getCacheDir } from "../../cache/state.js";
import { SecKCEvent } from "../../types.js";

const CACHE_FILE = join(getCacheDir(), "events-seckc.json");
const TTL_MS = 6 * 60 * 60 * 1000;
const UPCOMING_URL = "https://www.seckc.org/upcoming-events?format=json-pretty";

interface CacheShape {
  fetchedAt: number;
  events: SecKCEvent[];
}

export function readSecKCCache(): SecKCEvent[] {
  try {
    if (!existsSync(CACHE_FILE)) return [];
    const raw = readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as CacheShape;
    return parsed.events ?? [];
  } catch {
    return [];
  }
}

export function getNextSecKCEvent(now = Date.now()): SecKCEvent | null {
  const events = readSecKCCache();
  if (events.length === 0) return null;
  const nowDate = new Date(now);
  const upcoming = events
    .map((e) => ({ ...e, _date: new Date(e.start_date) }))
    .filter((e) => e._date.getTime() >= startOfDay(nowDate).getTime())
    .sort((a, b) => a._date.getTime() - b._date.getTime());
  if (upcoming.length === 0) return null;
  const next = upcoming[0]!;
  const days = Math.floor(
    (startOfDay(next._date).getTime() - startOfDay(nowDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return { ...next, days_until: days };
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function cacheIsStale(now = Date.now()): boolean {
  try {
    if (!existsSync(CACHE_FILE)) return true;
    const raw = readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as CacheShape;
    return now - (parsed.fetchedAt ?? 0) > TTL_MS;
  } catch {
    return true;
  }
}

// Spawn a detached child process to refresh the cache in the background.
export function refreshInBackground(): void {
  try {
    mkdirSync(getCacheDir(), { recursive: true });
    const child = spawn(
      process.execPath,
      ["-e", buildRefreshScript()],
      { detached: true, stdio: "ignore" }
    );
    child.unref();
  } catch {
    // ignore
  }
}

function buildRefreshScript(): string {
  return `
  const https = require('https');
  const fs = require('fs');
  const path = ${JSON.stringify(CACHE_FILE)};
  const url = ${JSON.stringify(UPCOMING_URL)};
  https.get(url, { timeout: 8000 }, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
      try {
        const j = JSON.parse(data);
        const items = (j.upcoming || j.items || []);
        const events = items.map((e) => ({
          title: e.title || 'SecKC',
          location: (e.location && e.location.addressLine1) || 'KC',
          time_local: new Date(e.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          start_date: new Date(e.startDate).toISOString(),
          days_until: 0,
          url: e.fullUrl || ''
        }));
        fs.writeFileSync(path, JSON.stringify({ fetchedAt: Date.now(), events }, null, 2));
      } catch (e) {}
    });
  }).on('error', () => {}).on('timeout', function() { this.destroy(); });
  `.trim();
}
