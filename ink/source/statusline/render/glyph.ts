/**
 * Glyph/icon registry — scene.icons[] → actual codepoints with ASCII fallback.
 * Scene icons can be referenced by id; missing ids fall back to their literal string.
 */
import { FontCaps } from "../types.js";

interface GlyphEntry {
  nerd: string;
  fallback: string;
}

const GLYPHS: Record<string, GlyphEntry> = {
  branch:     { nerd: "\ue0a0", fallback: "B:" },
  lock:       { nerd: "\uf023", fallback: "#" },
  padlock:    { nerd: "\uf023", fallback: "#" },
  unlock:     { nerd: "\uf09c", fallback: "o" },
  terminal:   { nerd: "\uf120", fallback: ">_" },
  gear:       { nerd: "\uf013", fallback: "*" },
  cloud:      { nerd: "\uf0c2", fallback: "~" },
  download:   { nerd: "\uf019", fallback: "v" },
  upload:     { nerd: "\uf093", fallback: "^" },
  floppy:     { nerd: "\uf0c7", fallback: "[" },
  cd:         { nerd: "\uf51f", fallback: "(" },
  wifi:       { nerd: "\uf1eb", fallback: "))" },
  bolt:       { nerd: "\uf0e7", fallback: "!" },
  skull:      { nerd: "\uf714", fallback: "X" },
  virus:      { nerd: "\ue214", fallback: "@" },
  ghost:      { nerd: "\uf6e2", fallback: "o" },
  heart:      { nerd: "\uf004", fallback: "<3" },
  star:       { nerd: "\uf005", fallback: "*" },
  fire:       { nerd: "\uf06d", fallback: "^" },
  radio:      { nerd: "\uf8d7", fallback: "))" },
  tape:       { nerd: "\uf4bd", fallback: "=" },
  disk:       { nerd: "\uf7c9", fallback: "(" },
  phone:      { nerd: "\uf095", fallback: "T" },
  crown:      { nerd: "\uf521", fallback: "^" },
};

export function resolveGlyphs(icons: string[] | undefined, caps: FontCaps): string[] {
  if (!icons || icons.length === 0) return [];
  return icons.map((id) => {
    const entry = GLYPHS[id];
    if (!entry) return id;
    return caps.nerdFont ? entry.nerd : entry.fallback;
  });
}

// Inject glyph tokens like {icon:branch} inline into the frame.
// Or prepend icons to the output if no inline markers.
export function injectGlyphs(
  frame: string,
  icons: string[] | undefined,
  caps: FontCaps
): string {
  const hasInline = /\{icon:[\w_]+\}/.test(frame);
  if (hasInline) {
    return frame.replace(/\{icon:([\w_]+)\}/g, (_m, id: string) => {
      const entry = GLYPHS[id];
      if (!entry) return "";
      return caps.nerdFont ? entry.nerd : entry.fallback;
    });
  }
  const resolved = resolveGlyphs(icons, caps);
  if (resolved.length === 0) return frame;
  return `${resolved.join(" ")} ${frame}`;
}
