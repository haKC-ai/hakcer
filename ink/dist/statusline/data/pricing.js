const MODELS = {
    "claude-opus-4-6": {
        displayName: "opus-4.6",
        contextTotal: 200_000,
        pricePerMillion: { input: 15, output: 75, cache_read: 1.5, cache_write: 18.75 },
    },
    "claude-sonnet-4-6": {
        displayName: "sonnet-4.6",
        contextTotal: 1_000_000,
        pricePerMillion: { input: 3, output: 15, cache_read: 0.3, cache_write: 3.75 },
    },
    "claude-haiku-4-5-20251001": {
        displayName: "haiku-4.5",
        contextTotal: 200_000,
        pricePerMillion: { input: 1, output: 5, cache_read: 0.1, cache_write: 1.25 },
    },
};
const FALLBACK = MODELS["claude-sonnet-4-6"];
export function lookupModel(modelId) {
    // exact match
    if (MODELS[modelId])
        return MODELS[modelId];
    // prefix match (strip date suffixes)
    for (const [key, val] of Object.entries(MODELS)) {
        if (modelId.startsWith(key.replace(/-\d{8}$/, "")))
            return val;
    }
    // family match
    if (modelId.includes("opus"))
        return MODELS["claude-opus-4-6"];
    if (modelId.includes("sonnet"))
        return MODELS["claude-sonnet-4-6"];
    if (modelId.includes("haiku"))
        return MODELS["claude-haiku-4-5-20251001"];
    return FALLBACK;
}
export function calcCost(modelId, tokens) {
    const pricing = lookupModel(modelId).pricePerMillion;
    const input = (tokens.input / 1_000_000) * pricing.input;
    const output = (tokens.output / 1_000_000) * pricing.output;
    const cache_read = (tokens.cache_read / 1_000_000) * pricing.cache_read;
    const cache_write = (tokens.cache_write / 1_000_000) * pricing.cache_write;
    return {
        input,
        output,
        cache_read,
        cache_write,
        totalUsd: input + output + cache_read + cache_write,
    };
}
export function calcContext(modelId, tokens) {
    const total = lookupModel(modelId).contextTotal;
    const used = tokens.input + tokens.cache_read + tokens.cache_write;
    const pct = Math.min(100, Math.round((used / total) * 100));
    return { used, total, pct };
}
export function displayModel(modelId) {
    return lookupModel(modelId).displayName;
}
//# sourceMappingURL=pricing.js.map