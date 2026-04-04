/**
 * Default haKCer ASCII art and utilities.
 */

export const HAKCER_ASCII = `
                 ██████████
                █▓       ░██
                █▒        ██
    █████████████░        █████████████████ ████████████ ████████████      ████████████
   ██         ███░        ███▓▒▒▒▒▒▒▒▒▒▒▒██ █▒▒▒▒▒▒▒▒▓████        █████████▓          ▒█
   ██         ███         ███▒▒▒▒▒▒▒▒▒▒▒▒▓██████████████▓        ███▓▒      ▒▓░       ▒█
   ██         ███        ░██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓██▓▒▒▒▒▒▒▒▒█▓        ███░       ░██░       ▒█
   ██         ███        ▒██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▒▒▒▒▒▒▒▓▒        ██  ▓        ██░       ▓█
   ██         ██▓        ███▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▓▒       ██   █        ██░       ▓
   ██         ██▒        ██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▓▒      ██    █        ▓█████████
   ██                    ██▒▒▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒   ▒███████ █░       ░▓        █
   ██         ░░         ██▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█ ▓        ░█ ▓       ░▒       ░█
   ██         ██░       ░█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█ █░        ▒ █                ░█
   ██         ██        ▓█▒▒▒▒▒▒▒▒▒██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█ █░        ▒ █░               ▒█
    ██████████  ███████████▓██▓▓█▓█  █▓▒▒▒▒▒▒▒▒▒▓██▓██   █▓▓▓▓▓▓▓█    █▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
  .:/====================█▓██▓██=========████▓█▓█ ███======> [ P R E S E N T S ] ====\\:.
        /\\                 ██▓██           █▓▓▓██ ██
 _ __  /  \\__________________█▓█_____________██▓██______________________________ _  _    _
_ __ \\/ /\\____________________██_____________ ███________ _________ __ _______ _
    \\  /         T H E   P I N A C L E    O F   H A K C I N G   Q U A L I T Y
     \\/
`;

/**
 * Convert ASCII art string into a 2D character grid.
 */
export function textToGrid(text: string): { grid: string[][]; rows: number; cols: number } {
  const rawLines = text.split("\n");

  // Trim leading/trailing empty lines
  let start = 0;
  while (start < rawLines.length && rawLines[start]!.trim() === "") start++;
  let end = rawLines.length - 1;
  while (end > start && rawLines[end]!.trim() === "") end--;

  const lines = rawLines.slice(start, end + 1);
  const cols = Math.max(...lines.map((l) => [...l].length));

  const grid: string[][] = lines.map((line) => {
    const chars = [...line];
    // Pad to max width
    while (chars.length < cols) chars.push(" ");
    return chars;
  });

  return { grid, rows: grid.length, cols };
}

/**
 * Center text based on terminal width.
 */
export function centerText(text: string, termWidth: number): string {
  const lines = text.split("\n");
  const maxLen = Math.max(...lines.map((l) => [...l].length));
  const padding = Math.max(0, Math.floor((termWidth - maxLen) / 2));
  return lines.map((l) => " ".repeat(padding) + l).join("\n");
}
