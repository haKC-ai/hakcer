const G = (nerd, fallback) => ({ nerd, fallback });
// ─── verb → glyph pair (case-insensitive) — covers all 128 unique verbs ──
const VERB_DECOR = {
    // data / session
    DECODING: { left: G("\uf023", "#"), right: G("\uf084", "K") },
    DECRYPTING: { left: G("\uf023", "#"), right: G("\uf0e7", "!") },
    ENCRYPTING: { left: G("\uf084", "K"), right: G("\uf023", "#") },
    ENCODING: { left: G("\uf121", "</>"), right: G("\uf0c7", "[") },
    COMPILING: { left: G("\uf121", "</>"), right: G("\uf013", "*") },
    DEBUGGING: { left: G("\uf188", "x"), right: G("\uf121", "</>") },
    PROGRAMMING: { left: G("\uf121", "</>"), right: G("\ue718", "n") },
    TESTING: { left: G("\uf0c3", "U"), right: G("\uf188", "x") },
    GENERATING: { left: G("\uf0d0", "/"), right: G("\uf121", "</>") },
    HASHING: { left: G("\uf3c5", "#"), right: G("\uf0e7", "!") },
    BUFFERING: { left: G("\uf110", "*"), right: G("\uf04b", ">") },
    RENDERING: { left: G("\uf008", "["), right: G("\uf030", "[") },
    VISUALIZING: { left: G("\uf06e", "o"), right: G("\uf5d2", "*") },
    ANIMATING: { left: G("\uf008", "["), right: G("\uf04b", ">") },
    FORMATTING: { left: G("\uf0a0", "["), right: G("\uf0ad", "~") },
    DEFRAGGING: { left: G("\uf0a0", "["), right: G("\uf013", "*") },
    TILING: { left: G("\uf00a", "#"), right: G("\uf009", "#") },
    CALIBRATING: { left: G("\uf013", "*"), right: G("\uf3fd", "~") },
    CONFIGURING: { left: G("\uf013", "*"), right: G("\uf085", "*") },
    PATCHING: { left: G("\uf0ad", "~"), right: G("\uf0c7", "[") },
    INSTALLING: { left: G("\uf019", "v"), right: G("\uf058", "v") },
    LOADING: { left: G("\uf110", "*"), right: G("\uf0e7", "!") },
    BOOTING: { left: G("\uf0e7", "!"), right: G("\uf120", ">_") },
    WAKING: { left: G("\uf185", "O"), right: G("\uf0e7", "!") },
    SAVING: { left: G("\uf0c7", "["), right: G("\uf00c", "v") },
    // hack / sec
    HACKING: { left: G("\uf714", "X"), right: G("\uf121", "</>") },
    CRACKING: { left: G("\uf0ad", "~"), right: G("\uf084", "K") },
    PHREAKING: { left: G("\uf095", "T"), right: G("\uf1d8", "^") },
    PWNING: { left: G("\uf714", "X"), right: G("\uf091", "Y") },
    FUZZING: { left: G("\uf7bf", "()"), right: G("\uf188", "x") },
    INFILTRATING: { left: G("\uf717", "*"), right: G("\uf3ed", "#") },
    EXPLOITING: { left: G("\uf1e2", "*"), right: G("\uf714", "X") },
    BACKDOORING: { left: G("\uf084", "K"), right: G("\uf714", "X") },
    HIJACKING: { left: G("\uf714", "X"), right: G("\uf1d8", "^") },
    INJECTING: { left: G("\uf577", "#"), right: G("\uf49e", "|") },
    EXFILTRATING: { left: G("\uf093", "^"), right: G("\uf714", "X") },
    SCANNING: { left: G("\uf002", "?"), right: G("\uf012", "|") },
    TRACING: { left: G("\uf002", "?"), right: G("\uf012", "|") },
    HANDSHAKING: { left: G("\uf4c6", "="), right: G("\uf3ed", "#") },
    OVERFLOWING: { left: G("\uf1e2", "*"), right: G("\uf071", "!") },
    OVERRIDING: { left: G("\uf0e2", "~"), right: G("\uf023", "#") },
    PANICKING: { left: G("\uf071", "!"), right: G("\uf714", "X") },
    NUKING: { left: G("\uf1e2", "*"), right: G("\uf0e7", "!") },
    INFECTING: { left: G("\ue214", "@"), right: G("\uf714", "X") },
    BLOWING: { left: G("\uf1e2", "*"), right: G("\uf06d", "^") },
    DELETING: { left: G("\uf1f8", "x"), right: G("\uf00d", "x") },
    CRASHING: { left: G("\uf071", "!"), right: G("\uf119", "x") },
    FREEING: { left: G("\uf09c", "o"), right: G("\uf024", "F") },
    // network / comm
    CONNECTING: { left: G("\uf1e6", "="), right: G("\uf0ac", "o") },
    TRANSFERRING: { left: G("\uf074", "<>"), right: G("\uf0ac", "o") },
    TRANSMITTING: { left: G("\uf519", "))"), right: G("\uf0ac", "o") },
    UPLOADING: { left: G("\uf093", "^"), right: G("\uf0ac", "o") },
    DOWNLOADING: { left: G("\uf019", "v"), right: G("\uf0ac", "o") },
    LEECHING: { left: G("\uf019", "v"), right: G("\uf0ac", "o") },
    SHARING: { left: G("\uf1e0", "="), right: G("\uf0ac", "o") },
    MESSAGING: { left: G("\uf0e0", "@"), right: G("\uf075", "<>") },
    CHATTING: { left: G("\uf086", "<>"), right: G("\uf075", "<>") },
    CONFERENCING: { left: G("\uf0c0", "@@"), right: G("\uf075", "<>") },
    MEETING: { left: G("\uf0c0", "@@"), right: G("\uf017", "O") },
    ORDERING: { left: G("\uf290", "$"), right: G("\uf155", "$") },
    DIALING: { left: G("\uf095", "T"), right: G("\uf0e7", "!") },
    CALLING: { left: G("\uf095", "T"), right: G("\uf519", "))") },
    SEARCHING: { left: G("\uf002", "?"), right: G("\uf0ac", "o") },
    ACCESSING: { left: G("\uf023", "#"), right: G("\uf09c", "o") },
    BROWSING: { left: G("\uf268", "o"), right: G("\uf0ac", "o") },
    NAVIGATING: { left: G("\uf14e", "^"), right: G("\uf0ac", "o") },
    INCOMING: { left: G("\uf073", "<-"), right: G("\uf0e0", "@") },
    PUBLISHING: { left: G("\uf093", "^"), right: G("\uf02d", "[") },
    // games / theater
    RAMPAGE: { left: G("\uf6d5", "d"), right: G("\uf06d", "^") },
    SLITHERING: { left: G("\uf716", "~"), right: G("\uf005", "*") },
    CHOMPING: { left: G("\uf11b", "()"), right: G("\uf6e2", "o") },
    RUNNING: { left: G("\uf70c", ">"), right: G("\uf1b0", "v") },
    CHASING: { left: G("\uf6e2", "o"), right: G("\uf11b", "()") },
    RALLYING: { left: G("\uf26c", "["), right: G("\uf091", "Y") },
    PLAYING: { left: G("\uf04b", ">"), right: G("\uf001", "J") },
    SCORING: { left: G("\uf091", "Y"), right: G("\uf005", "*") },
    WINNING: { left: G("\uf091", "Y"), right: G("\uf521", "^") },
    COMPETING: { left: G("\uf091", "Y"), right: G("\uf140", "+") },
    RACING: { left: G("\uf1b9", "="), right: G("\uf091", "Y") },
    BATTLING: { left: G("\uf0fb", "/"), right: G("\uf3ed", "#") },
    FIGHTING: { left: G("\uf0fb", "/"), right: G("\uf6ce", "*") },
    HUNTING: { left: G("\uf19c", "^"), right: G("\uf140", "+") },
    QUESTING: { left: G("\uf140", "+"), right: G("\uf521", "^") },
    CONQUERING: { left: G("\uf521", "^"), right: G("\uf091", "Y") },
    RESCUING: { left: G("\uf0fa", "+"), right: G("\uf005", "*") },
    SURVIVING: { left: G("\uf3ed", "#"), right: G("\uf06c", "^") },
    DYING: { left: G("\uf714", "X"), right: G("\uf54c", "+") },
    CHEATING: { left: G("\uf6e8", "^"), right: G("\uf522", "#") },
    COLLECTING: { left: G("\uf005", "*"), right: G("\uf091", "Y") },
    STEALING: { left: G("\uf6fa", "@"), right: G("\uf0a4", "<-") },
    TRADING: { left: G("\uf074", "<>"), right: G("\uf155", "$") },
    DEPOSITING: { left: G("\uf19c", "["), right: G("\uf155", "$") },
    CASTING: { left: G("\uf6e8", "^"), right: G("\uf0d0", "/") },
    SPELLING: { left: G("\uf02d", "["), right: G("\uf6e8", "^") },
    SUMMONING: { left: G("\uf6e8", "^"), right: G("\uf0d0", "/") },
    LEAPING: { left: G("\uf017", "O"), right: G("\uf005", "*") },
    WARPING: { left: G("\uf135", "^"), right: G("\uf186", "(") },
    TRAVELING: { left: G("\uf072", "+"), right: G("\uf0ac", "o") },
    CROSSING: { left: G("\uf14e", "^"), right: G("\uf21a", "~") },
    JOINING: { left: G("\uf067", "+"), right: G("\uf0c0", "@@") },
    // life / food
    BREWING: { left: G("\uf0f4", "c"), right: G("\uf06d", "^") },
    EATING: { left: G("\uf2e7", "Y"), right: G("\uf0f4", "c") },
    FEEDING: { left: G("\uf2e7", "Y"), right: G("\uf1b0", "v") },
    BAKING: { left: G("\uf1fd", "*"), right: G("\uf06d", "^") },
    SWIMMING: { left: G("\uf578", "<>"), right: G("\uf043", "o") },
    READING: { left: G("\uf02d", "["), right: G("\uf06e", "o") },
    MEMORIZING: { left: G("\uf02d", "["), right: G("\uf2db", "[") },
    TYPING: { left: G("\uf11c", "="), right: G("\uf120", ">_") },
    TAPPING: { left: G("\uf25a", "^"), right: G("\uf11c", "=") },
    WELDING: { left: G("\uf0e7", "!"), right: G("\uf6e3", "t") },
    BUILDING: { left: G("\uf1ad", "["), right: G("\uf6e3", "t") },
    MANIFESTING: { left: G("\uf0eb", "o"), right: G("\uf0d0", "/") },
    FORMING: { left: G("\uf0d0", "/"), right: G("\uf100", "*") },
    HOLDING: { left: G("\uf256", "["), right: G("\uf005", "*") },
    LAUNCHING: { left: G("\uf135", "^"), right: G("\uf06d", "!") },
    FIRING: { left: G("\uf06d", "^"), right: G("\uf071", "!") },
    PUMPING: { left: G("\uf043", "o"), right: G("\uf0e7", "!") },
    PUNTING: { left: G("\uf1e3", "o"), right: G("\uf005", "*") },
    SCROLLING: { left: G("\uf02d", "["), right: G("\uf175", "v") },
    FLIRTING: { left: G("\uf004", "<3"), right: G("\uf075", "<>") },
    JUDGING: { left: G("\uf24e", "|"), right: G("\uf0e3", "|") },
    TESTIFYING: { left: G("\uf24e", "|"), right: G("\uf02d", "[") },
    BOPPING: { left: G("\uf001", "J"), right: G("\uf025", "n") },
    BLAMING: { left: G("\uf25a", "^"), right: G("\uf24e", "|") },
    DISCLAIMING: { left: G("\uf071", "!"), right: G("\uf02d", "[") },
    CONTROLLING: { left: G("\uf11b", "()"), right: G("\uf3fd", "~") },
    COMMANDING: { left: G("\uf120", ">_"), right: G("\uf521", "^") },
    CAPTURING: { left: G("\uf030", "["), right: G("\uf0c7", "[") },
    DETECTING: { left: G("\uf002", "?"), right: G("\uf0eb", "o") },
    ALERTING: { left: G("\uf0f3", "!"), right: G("\uf071", "!") },
    TARGETING: { left: G("\uf140", "+"), right: G("\uf05b", "o") },
    CHOOSING: { left: G("\uf00c", "v"), right: G("\uf0ad", "~") },
    STUTTERING: { left: G("\uf4ad", "<>"), right: G("\uf120", ">_") },
    CONTINUING: { left: G("\uf04b", ">"), right: G("\uf0e7", "!") },
    FINISHING: { left: G("\uf091", "Y"), right: G("\uf00c", "v") },
    TONIGHT: { left: G("\uf186", "("), right: G("\uf005", "*") },
    WARNING: { left: G("\uf071", "!"), right: G("\uf0f3", "!") },
};
// ─── pack → glyph pair (fallback if verb doesn't match) ───────────────────
const PACK_DECOR = {
    core: { left: G("\uf120", ">_"), right: G("\uf0e7", "!") }, // terminal / bolt
    warez: { left: G("\uf023", "#"), right: G("\uf051", "-") }, // lock / fwd
    phreaking: { left: G("\uf095", "T"), right: G("\uf519", "))") }, // phone / wave
    aol: { left: G("\uf0e0", "@"), right: G("\uf5a0", "))") }, // envelope / im
    p2p: { left: G("\uf019", "v"), right: G("\uf0ed", "^") }, // download / cloud-dl
    bbs: { left: G("\uf095", "T"), right: G("\uf086", "<>") }, // phone / comments
    mud: { left: G("\uf6d5", "d"), right: G("\uf6e8", "^") }, // dragon / wizhat
    movies: { left: G("\uf008", "["), right: G("\uf144", ">") }, // film / play-circle
    cartoons: { left: G("\uf008", "["), right: G("\uf005", "*") }, // film / star
    toys: { left: G("\uf1b0", "v"), right: G("\uf005", "*") }, // paw / star
    arcade: { left: G("\uf11b", "()"), right: G("\uf091", "Y") }, // gamepad / trophy
    console: { left: G("\uf11b", "()"), right: G("\uf04b", ">") }, // gamepad / play
    dos: { left: G("\uf17a", "W"), right: G("\uf120", ">_") }, // windows / terminal
    early_web: { left: G("\uf0ac", "o"), right: G("\uf005", "*") }, // globe / star
    trikc: { left: G("\uf6fa", "@"), right: G("\uf521", "^") }, // mask / crown
    tv80s: { left: G("\uf26c", "["), right: G("\uf008", "[") }, // tv / film
    cinema: { left: G("\uf008", "["), right: G("\uf091", "Y") }, // film / trophy
    "2600": { left: G("\uf11b", "()"), right: G("\uf005", "*") }, // gamepad / star
    cartoon_flipbook: { left: G("\uf008", "["), right: G("\uf005", "*") }, // film / star
};
const DEFAULT_DECOR = {
    left: G("\uf120", ">_"), // terminal
    right: G("\uf0e7", "!"), // bolt
};
export function decoratorFor(scene) {
    const verbKey = (scene.verb ?? "").toUpperCase();
    if (VERB_DECOR[verbKey])
        return VERB_DECOR[verbKey];
    if (PACK_DECOR[scene.pack])
        return PACK_DECOR[scene.pack];
    return DEFAULT_DECOR;
}
export function decorate(text, scene, caps) {
    const pair = decoratorFor(scene);
    const left = caps.nerdFont ? pair.left.nerd : pair.left.fallback;
    const right = caps.nerdFont ? pair.right.nerd : pair.right.fallback;
    return `${left} ${text} ${right}`;
}
//# sourceMappingURL=decorate.js.map