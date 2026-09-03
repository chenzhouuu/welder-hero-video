/** Deterministic easing helpers on normalised progress (0..1). No Remotion dependency. */
export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Map p from [a, b] to [0, 1], clamped. */
export const seg = (p: number, a: number, b: number): number => clamp01((p - a) / (b - a));

export const easeOutCubic = (x: number): number => 1 - Math.pow(1 - clamp01(x), 3);
export const easeInOutCubic = (x: number): number => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeOutQuint = (x: number): number => 1 - Math.pow(1 - clamp01(x), 5);
export const easeInCubic = (x: number): number => Math.pow(clamp01(x), 3);

/** Eased 0→1 over [a, b] of p. */
export const rise = (p: number, a: number, b: number, ease = easeOutCubic): number => ease(seg(p, a, b));
/** Eased 1→0 over [a, b] of p. */
export const fall = (p: number, a: number, b: number, ease = easeInCubic): number => 1 - ease(seg(p, a, b));
/** In over [a, b], hold, out over [c, d]. */
export const window01 = (p: number, a: number, b: number, c: number, d: number): number =>
  Math.min(rise(p, a, b), fall(p, c, d));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const mix = (a: number, b: number, t: number): number => lerp(a, b, clamp01(t));
