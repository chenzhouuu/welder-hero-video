import {Easing, interpolate, spring} from 'remotion';

/** Clamp-interpolate a frame into [from, to] over [start, end]. */
export const ramp = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number =>
  interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** 0→1 fade in over `dur` frames starting at `start`. */
export const fadeIn = (frame: number, start: number, dur = 18): number =>
  ramp(frame, start, start + dur, 0, 1, Easing.out(Easing.cubic));

/** 1→0 fade out over `dur` frames ending at `end`. */
export const fadeOut = (frame: number, end: number, dur = 18): number =>
  ramp(frame, end - dur, end, 1, 0, Easing.in(Easing.cubic));

/** Fade in at the start and out at the end of a window. */
export const hold = (frame: number, start: number, end: number, dur = 18): number =>
  Math.min(fadeIn(frame, start, dur), fadeOut(frame, end, dur));

/** Spring 0→1 starting at `start` (gentle, no overshoot by default). */
export const pop = (
  frame: number,
  fps: number,
  start: number,
  cfg: {damping?: number; stiffness?: number; mass?: number} = {},
): number =>
  spring({
    frame: frame - start,
    fps,
    config: {damping: 200, stiffness: 120, mass: 0.8, ...cfg},
  });

/** Character count for a typewriter reveal. */
export const typed = (frame: number, start: number, text: string, cps = 1.6): string => {
  const n = Math.max(0, Math.floor((frame - start) * cps));
  return text.slice(0, Math.min(text.length, n));
};

/** Stagger helper: index i starts `gap` frames after the previous one. */
export const stagger = (i: number, start: number, gap: number): number => start + i * gap;

/** Linear map without clamping. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
