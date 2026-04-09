/**
 * Per-model pricing + context window maxes.
 * Prices in USD per 1M tokens.
 */
import { CostInfo, ContextInfo, TokenUsage } from "../types.js";
interface ModelPricing {
    displayName: string;
    contextTotal: number;
    pricePerMillion: {
        input: number;
        output: number;
        cache_read: number;
        cache_write: number;
    };
}
export declare function lookupModel(modelId: string): ModelPricing;
export declare function calcCost(modelId: string, tokens: TokenUsage): CostInfo;
export declare function calcContext(modelId: string, tokens: TokenUsage): ContextInfo;
export declare function displayModel(modelId: string): string;
export {};
//# sourceMappingURL=pricing.d.ts.map