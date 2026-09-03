import {clamp01, easeInOutCubic, easeOutCubic} from './ease';

/**
 * Time-keyed property tracks. The story is one continuous timeline, so every persistent
 * object (footage, photo, traces) has its geometry and opacity expressed as a track over
 * absolute seconds. A hold is two keys with the same value.
 */
export type Key = [t: number, v: number];
export type Ease = (x: number) => number;

/** Piecewise interpolation between keys, eased per segment. Flat before the first and after the last key. */
export const track = (t: number, keys: Key[], ease: Ease = easeInOutCubic): number => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t0, v0] = keys[i - 1];
    const [t1, v1] = keys[i];
    if (t <= t1) {
      const u = t1 > t0 ? (t - t0) / (t1 - t0) : 1;
      return v0 + (v1 - v0) * ease(u);
    }
  }
  return keys[keys.length - 1][1];
};

export type Rect = {x: number; y: number; w: number; h: number};
export type RectKey = [t: number, r: Rect];

/** Rectangle track (each field interpolated with the same easing). */
export const rectTrack = (t: number, keys: RectKey[], ease: Ease = easeInOutCubic): Rect => ({
  x: track(t, keys.map(([tt, r]) => [tt, r.x]), ease),
  y: track(t, keys.map(([tt, r]) => [tt, r.y]), ease),
  w: track(t, keys.map(([tt, r]) => [tt, r.w]), ease),
  h: track(t, keys.map(([tt, r]) => [tt, r.h]), ease),
});

/** 0 before a, eased to 1 at b. */
export const on = (t: number, a: number, b: number, ease: Ease = easeOutCubic): number => ease(clamp01((t - a) / (b - a)));
/** 1 before a, eased to 0 at b. */
export const off = (t: number, a: number, b: number, ease: Ease = easeOutCubic): number => 1 - ease(clamp01((t - a) / (b - a)));
/** In over [a, b], hold, out over [c, d]. */
export const win = (t: number, a: number, b: number, c: number, d: number): number => Math.min(on(t, a, b), off(t, c, d));
/** Linear 0→1 over [a, b] (for write-on heads and sweeps). */
export const lin = (t: number, a: number, b: number): number => clamp01((t - a) / (b - a));
/** True while t is inside [a, b). */
export const inside = (t: number, a: number, b: number): boolean => t >= a && t < b;
