/**
 * Color utilities for hex-to-ANSI conversion and gradient interpolation.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToAnsi(rgb: RGB): string {
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
}

export function resetAnsi(): string {
  return "\x1b[0m";
}

export function colorize(char: string, hex: string): string {
  if (char === " " || char === "\n") return char;
  const rgb = hexToRgb(hex);
  return `${rgbToAnsi(rgb)}${char}${resetAnsi()}`;
}

export function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Generate a gradient across `steps` positions using the given hex color stops.
 */
export function gradient(stops: string[], steps: number): string[] {
  if (steps <= 0) return [];
  if (steps === 1) return [stops[0]!];
  if (stops.length === 1) return Array(steps).fill(stops[0]);

  const rgbStops = stops.map(hexToRgb);
  const result: string[] = [];
  const segmentSize = (steps - 1) / (rgbStops.length - 1);

  for (let i = 0; i < steps; i++) {
    const segment = Math.min(
      Math.floor(i / segmentSize),
      rgbStops.length - 2
    );
    const t = (i - segment * segmentSize) / segmentSize;
    result.push(rgbToHex(lerpColor(rgbStops[segment]!, rgbStops[segment + 1]!, t)));
  }

  return result;
}

/**
 * Apply a gradient to a line of text, returning ANSI-colored string.
 */
export function applyGradient(text: string, colors: string[]): string {
  const chars = [...text];
  const visibleChars = chars.filter((c) => c !== " ");
  const grad = gradient(colors, visibleChars.length || 1);

  let colorIdx = 0;
  return chars
    .map((ch) => {
      if (ch === " ") return ch;
      return colorize(ch, grad[colorIdx++] ?? colors[0]!);
    })
    .join("");
}
