import { SecKCEvent } from "../../types.js";
export declare function readSecKCCache(): SecKCEvent[];
export declare function getNextSecKCEvent(now?: number): SecKCEvent | null;
export declare function cacheIsStale(now?: number): boolean;
export declare function refreshInBackground(): void;
//# sourceMappingURL=seckc.d.ts.map