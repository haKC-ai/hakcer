/**
 * Banner — React component that renders animated ASCII art using Ink.
 *
 * Usage:
 *   <Banner />
 *   <Banner effect="decrypt" theme="cyberpunk" />
 *   <Banner customText={myAscii} onComplete={() => console.log('done')} />
 */
export interface BannerProps {
    /** Specific effect name. Random if omitted. */
    effect?: string;
    /** Speed preference for random selection. */
    speedPreference?: "fast" | "medium" | "slow" | "any";
    /** Theme name. Uses current global theme if omitted. */
    theme?: string;
    /** Custom ASCII art text. */
    customText?: string;
    /** Milliseconds between frames. Default 60. */
    frameInterval?: number;
    /** Seconds to hold after animation completes. Default 0 (stays rendered). */
    holdTime?: number;
    /** Callback when animation completes. */
    onComplete?: () => void;
}
export declare function Banner({ effect, speedPreference, theme, customText, frameInterval, holdTime, onComplete, }: BannerProps): import("react/jsx-runtime").JSX.Element;
export default Banner;
//# sourceMappingURL=Banner.d.ts.map