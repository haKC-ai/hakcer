/**
 * Trigger rules — priority-ordered. First match wins.
 * Matched triggers write { triggerId, force, pinnedUntil } to state.json.
 * Subsequent invocations within the pin window replay the forced scene.
 */
import { SessionData, Trigger, PersistentState } from "../types.js";

export const TRIGGERS: Trigger[] = [
  { id: "ctx-critical", when: (d) => d.context.pct >= 98, force: "core_kernel_panic",    durationSeconds: 60 },
  { id: "ctx-overflow", when: (d) => d.context.pct >= 90, force: "core_buffer_overflow", durationSeconds: 40 },
  { id: "ctx-decrypt",  when: (d) => d.context.pct >= 75, force: "core_decrypt",         durationSeconds: 30 },
  { id: "ctx-crack",    when: (d) => d.context.pct >= 50, force: "core_base64",          durationSeconds: 30 },
  { id: "cost-pwned",   when: (d) => d.cost.totalUsd >= 10, force: "core_msf",           durationSeconds: 90 },
  { id: "cost-warn",    when: (d) => d.cost.totalUsd >=  5, force: "core_msf",           durationSeconds: 30 },
];

export function evaluateTriggers(
  data: SessionData,
  state: PersistentState,
  now: number
): { force: string; triggerId: string; pinnedUntil: number } | null {
  // Honor active pin
  if (state.activeOverride && state.activeOverride.pinnedUntil > now) {
    return {
      force: state.activeOverride.force,
      triggerId: state.activeOverride.triggerId,
      pinnedUntil: state.activeOverride.pinnedUntil,
    };
  }

  for (const t of TRIGGERS) {
    if (t.when(data)) {
      return {
        force: t.force,
        triggerId: t.id,
        pinnedUntil: now + t.durationSeconds * 1000,
      };
    }
  }

  return null;
}
