/**
 * Dotted-path data resolver for scene `data_map` templates.
 * Scene says `"data_map": {"title": "events.seckc.next.title"}`
 * We walk `tree.events.seckc.next.title` and substitute into `{title}`.
 */
import { ResolvedData, SessionData } from "../types.js";

export function resolveDataPath(tree: ResolvedData, path: string): string {
  if (!path) return "—";
  const parts = path.split(".");
  let cur: unknown = tree;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return "—";
    cur = (cur as Record<string, unknown>)[p];
  }
  if (cur == null) return "—";
  return String(cur);
}

export function applyDataMap(
  frame: string,
  dataMap: Record<string, string> | undefined,
  tree: ResolvedData
): string {
  return frame.replace(/\{(\w+(?:\.\w+)*)\}/g, (match, key: string) => {
    // 1. explicit data_map mapping wins
    const mapped = dataMap?.[key];
    if (mapped) return resolveDataPath(tree, mapped);

    // 2. fall through — try the placeholder name directly as a dotted path
    // into the resolved tree. This catches scenes that don't declare every
    // placeholder but use canonical names like {model}, {ctx_bar}, {cost}.
    const direct = resolveDataPath(tree, key);
    if (direct !== "—") return direct;

    // 3. unresolved → leave visible (contributor bug)
    return match;
  });
}

// ──────────────────────────────────────────────────────────────────────────
// Build the ResolvedData tree from raw SessionData.
// Produces pre-formatted display strings AND tick-dependent partials.
// ──────────────────────────────────────────────────────────────────────────

export function buildResolvedData(session: SessionData, tick: number): ResolvedData {
  const model = session.model || "—";
  const costRaw = session.cost.totalUsd;
  const cost = costRaw >= 100 ? `$${costRaw.toFixed(0)}` : `$${costRaw.toFixed(2)}`;
  const ctxPct = session.context.pct;
  const ctxBar = renderCtxBar(ctxPct, 8);
  const git = session.git?.branch || "—";

  return {
    model,
    model_id: session.modelId || "—",
    cost,
    cost_raw: costRaw,
    context: `${ctxPct}%`,
    context_pct: ctxPct,
    context_used: session.context.used,
    context_total: session.context.total,
    ctx_bar: ctxBar,
    ctx: String(ctxPct),
    git,
    git_branch: git,
    git_dirty: session.git?.dirty ?? false,

    // tick-dependent partials — used by decrypt_reveal/glitch scenes
    model_partial: partialDecrypt(model, tick, 0),
    cost_partial: partialDecrypt(cost, tick, 1),
    ctx_partial: partialDecrypt(`${ctxPct}%`, tick, 2),
    git_partial: partialDecrypt(git, tick, 3),

    tokens: {
      input: session.tokens.input,
      output: session.tokens.output,
      cache_read: session.tokens.cache_read,
      cache_write: session.tokens.cache_write,
      total: session.tokens.total,
    },

    events: session.events ?? {},
  };
}

function renderCtxBar(pct: number, width: number): string {
  const filled = Math.round((pct / 100) * width);
  return "█".repeat(filled) + "░".repeat(Math.max(0, width - filled));
}

const CIPHER = "▓▒░█▀▄◆◇◈◊@#$%&?!";

function partialDecrypt(text: string, tick: number, seed: number): string {
  // Each char has a "reveal tick" based on its position + seed.
  // As tick advances, more chars are revealed. Unrevealed chars show cipher glyphs.
  const out: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const revealAt = (i * 3 + seed * 7) % 40;
    if ((tick % 40) >= revealAt) {
      out.push(text[i]!);
    } else {
      out.push(CIPHER[(tick + i + seed) % CIPHER.length]!);
    }
  }
  return out.join("");
}
