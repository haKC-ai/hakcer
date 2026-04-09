const GLYPHS = {
    // existing
    branch: { nerd: "\ue0a0", fallback: "B:" },
    lock: { nerd: "\uf023", fallback: "#" },
    padlock: { nerd: "\uf023", fallback: "#" },
    unlock: { nerd: "\uf09c", fallback: "o" },
    terminal: { nerd: "\uf120", fallback: ">_" },
    gear: { nerd: "\uf013", fallback: "*" },
    cloud: { nerd: "\uf0c2", fallback: "~" },
    download: { nerd: "\uf019", fallback: "v" },
    upload: { nerd: "\uf093", fallback: "^" },
    floppy: { nerd: "\uf0c7", fallback: "[" },
    cd: { nerd: "\uf51f", fallback: "(" },
    wifi: { nerd: "\uf1eb", fallback: "))" },
    bolt: { nerd: "\uf0e7", fallback: "!" },
    skull: { nerd: "\uf714", fallback: "X" },
    virus: { nerd: "\ue214", fallback: "@" },
    ghost: { nerd: "\uf6e2", fallback: "o" },
    heart: { nerd: "\uf004", fallback: "<3" },
    star: { nerd: "\uf005", fallback: "*" },
    fire: { nerd: "\uf06d", fallback: "^" },
    radio: { nerd: "\uf8d7", fallback: "))" },
    tape: { nerd: "\uf4bd", fallback: "=" },
    disk: { nerd: "\uf7c9", fallback: "(" },
    phone: { nerd: "\uf095", fallback: "T" },
    crown: { nerd: "\uf521", fallback: "^" },
    // missing from scenes.json — FontAwesome codepoints in Nerd Font
    bomb: { nerd: "\uf1e2", fallback: "*" },
    book: { nerd: "\uf02d", fallback: "[" },
    bug: { nerd: "\uf188", fallback: "X" },
    clock: { nerd: "\uf017", fallback: "O" },
    comment: { nerd: "\uf075", fallback: "<>" },
    compact_disc: { nerd: "\uf51f", fallback: "(" },
    envelope: { nerd: "\uf0e0", fallback: "@" },
    eye: { nerd: "\uf06e", fallback: "o" },
    film: { nerd: "\uf008", fallback: "[" },
    gamepad: { nerd: "\uf11b", fallback: "()" },
    globe: { nerd: "\uf0ac", fallback: "o" },
    hdd: { nerd: "\uf0a0", fallback: "[" },
    key: { nerd: "\uf084", fallback: "-o" },
    microchip: { nerd: "\uf2db", fallback: "[" },
    music: { nerd: "\uf001", fallback: "J" },
    paint: { nerd: "\uf1fc", fallback: "~" },
    plug: { nerd: "\uf1e6", fallback: "=" },
    radio_wave: { nerd: "\uf519", fallback: "))" },
    rocket: { nerd: "\uf135", fallback: "^" },
    save: { nerd: "\uf0c7", fallback: "[" },
    server: { nerd: "\uf233", fallback: "[" },
    shield: { nerd: "\uf132", fallback: "#" },
    signal: { nerd: "\uf012", fallback: "|" },
    spinner: { nerd: "\uf110", fallback: "*" },
    trash: { nerd: "\uf1f8", fallback: "x" },
    trophy: { nerd: "\uf091", fallback: "Y" },
    user: { nerd: "\uf007", fallback: "@" },
    users: { nerd: "\uf0c0", fallback: "@@" },
    warning: { nerd: "\uf071", fallback: "!" },
    wrench: { nerd: "\uf0ad", fallback: "~" },
    play: { nerd: "\uf04b", fallback: ">" },
    // creatures, nature, scenery — for flipbook cartoons
    dragon: { nerd: "\uf6d5", fallback: "d" },
    fish: { nerd: "\uf578", fallback: "<>" },
    paw: { nerd: "\uf1b0", fallback: "v" },
    tree: { nerd: "\uf1bb", fallback: "T" },
    biohazard: { nerd: "\uf780", fallback: "@" },
    crosshair: { nerd: "\uf140", fallback: "+" },
    cogs: { nerd: "\uf085", fallback: "**" },
    code: { nerd: "\uf121", fallback: "</>" },
    tv: { nerd: "\uf26c", fallback: "[" },
    ship: { nerd: "\uf21a", fallback: "~" },
    dna: { nerd: "\uf471", fallback: "X" },
    flag: { nerd: "\uf024", fallback: "F" },
    leaf: { nerd: "\uf06c", fallback: "^" },
    snowflake: { nerd: "\uf2dc", fallback: "*" },
    moon: { nerd: "\uf186", fallback: "(" },
    sun: { nerd: "\uf185", fallback: "O" },
    cloud_rain: { nerd: "\uf73d", fallback: "~" },
    coffee: { nerd: "\uf0f4", fallback: "c" },
    pizza: { nerd: "\uf817", fallback: "p" },
    apple: { nerd: "\uf8d2", fallback: "o" },
    // brand & platform logos (devicons / fa)
    linux: { nerd: "\uf17c", fallback: "L" },
    apple_logo: { nerd: "\uf179", fallback: "A" },
    windows: { nerd: "\uf17a", fallback: "W" },
    github: { nerd: "\uf09b", fallback: "G" },
    git: { nerd: "\uf1d3", fallback: "g" },
    python: { nerd: "\ue73c", fallback: "py" },
    javascript: { nerd: "\ue74e", fallback: "js" },
    typescript: { nerd: "\ue628", fallback: "ts" },
    node: { nerd: "\ue718", fallback: "nd" },
    react: { nerd: "\ue7ba", fallback: "rx" },
    docker: { nerd: "\uf308", fallback: "dk" },
    ubuntu: { nerd: "\uf31b", fallback: "ub" },
    debian: { nerd: "\uf306", fallback: "db" },
    fedora: { nerd: "\uf30a", fallback: "fd" },
    arch: { nerd: "\uf303", fallback: "ar" },
    android: { nerd: "\uf17b", fallback: "an" },
    chrome: { nerd: "\uf268", fallback: "ch" },
    firefox: { nerd: "\uf269", fallback: "ff" },
    // network/security
    shield_check: { nerd: "\uf3ed", fallback: "#" },
    certificate: { nerd: "\uf0a3", fallback: "*" },
    fingerprint: { nerd: "\uf577", fallback: "o" },
    satellite: { nerd: "\uf7bf", fallback: "()" },
    ethernet: { nerd: "\uf796", fallback: "=" },
    broadcast: { nerd: "\uf519", fallback: "))" },
    firewall: { nerd: "\uf490", fallback: "|" },
    // tools
    pencil: { nerd: "\uf303", fallback: "/" },
    pen: { nerd: "\uf304", fallback: "/" },
    edit: { nerd: "\uf14b", fallback: "e" },
    hammer: { nerd: "\uf6e3", fallback: "t" },
    screwdriver: { nerd: "\uf54a", fallback: "-" },
    soldering: { nerd: "\uf5d1", fallback: "~" },
    // creatures (more)
    cat: { nerd: "\uf6be", fallback: "=^" },
    dog: { nerd: "\uf6d3", fallback: "d" },
    frog: { nerd: "\uf52e", fallback: "@" },
    spider: { nerd: "\uf717", fallback: "*" },
    crow: { nerd: "\uf520", fallback: "v" },
    horse: { nerd: "\uf6f0", fallback: "h" },
    snake: { nerd: "\uf716", fallback: "~" },
    otter: { nerd: "\uf700", fallback: "o" },
    hippo: { nerd: "\uf6ed", fallback: "H" },
    // nature (more)
    mountain: { nerd: "\uf6fc", fallback: "^" },
    water_drop: { nerd: "\uf043", fallback: "o" },
    volcano: { nerd: "\uf770", fallback: "^" },
    wind: { nerd: "\uf72e", fallback: "~" },
    umbrella: { nerd: "\uf0e9", fallback: "U" },
    cactus: { nerd: "\uf8a7", fallback: "Y" },
    seedling: { nerd: "\uf4d8", fallback: "y" },
    atom: { nerd: "\uf5d2", fallback: "*" },
    dna_helix: { nerd: "\uf471", fallback: "X" },
    flask: { nerd: "\uf0c3", fallback: "U" },
    microscope: { nerd: "\uf610", fallback: "o" },
    magnet: { nerd: "\uf076", fallback: "U" },
    // transit / vehicles
    car: { nerd: "\uf1b9", fallback: "=" },
    truck: { nerd: "\uf0d1", fallback: "=" },
    train: { nerd: "\uf238", fallback: "=" },
    plane: { nerd: "\uf072", fallback: "+" },
    helicopter: { nerd: "\uf533", fallback: "X" },
    subway: { nerd: "\uf239", fallback: "=" },
    anchor: { nerd: "\uf13d", fallback: "!" },
    sailboat: { nerd: "\ue7c5", fallback: "~" },
    // food/drink
    beer: { nerd: "\uf0fc", fallback: "B" },
    burger: { nerd: "\uf805", fallback: "@" },
    taco: { nerd: "\uf826", fallback: "D" },
    ice_cream: { nerd: "\uf810", fallback: "Y" },
    candy: { nerd: "\uf786", fallback: "*" },
    wine: { nerd: "\uf72f", fallback: "Y" },
    // misc
    bitcoin: { nerd: "\uf15a", fallback: "B" },
    dollar: { nerd: "\uf155", fallback: "$" },
    eye_slash: { nerd: "\uf070", fallback: "x" },
    mask: { nerd: "\uf6fa", fallback: "@" },
    hat_wizard: { nerd: "\uf6e8", fallback: "^" },
    magic: { nerd: "\uf0d0", fallback: "/" },
    dice: { nerd: "\uf522", fallback: "#" },
    chess_knight: { nerd: "\uf441", fallback: "N" },
    puzzle: { nerd: "\uf12e", fallback: "[" },
    microphone: { nerd: "\uf130", fallback: "!" },
    headphones: { nerd: "\uf025", fallback: "n" },
    camera: { nerd: "\uf030", fallback: "[" },
    video: { nerd: "\uf03d", fallback: "[" },
    lightbulb: { nerd: "\uf0eb", fallback: "o" },
    dumpster_fire: { nerd: "\uf794", fallback: "!" },
    alien: { nerd: "\uf8f5", fallback: "@" },
    robot: { nerd: "\uf544", fallback: "@" },
};
export function resolveGlyphs(icons, caps) {
    if (!icons || icons.length === 0)
        return [];
    return icons.map((id) => {
        const entry = GLYPHS[id];
        if (!entry)
            return "";
        return caps.nerdFont ? entry.nerd : entry.fallback;
    });
}
// Inject glyph tokens like {icon:branch} inline into the frame.
// Or prepend icons to the output if no inline markers.
export function injectGlyphs(frame, icons, caps) {
    const hasInline = /\{icon:[\w_]+\}/.test(frame);
    if (hasInline) {
        return frame.replace(/\{icon:([\w_]+)\}/g, (_m, id) => {
            const entry = GLYPHS[id];
            if (!entry)
                return "";
            return caps.nerdFont ? entry.nerd : entry.fallback;
        });
    }
    const resolved = resolveGlyphs(icons, caps).filter((g) => g.length > 0);
    if (resolved.length === 0)
        return frame;
    return `${resolved.join(" ")} ${frame}`;
}
//# sourceMappingURL=glyph.js.map