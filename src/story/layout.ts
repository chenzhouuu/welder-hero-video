import {rectTrack, track, type Rect} from '../lib/track';
import type {View} from '../components/Photo';
import type {Lane} from '../components/TraceLane';
import {tokens} from '../styles/tokens';
import {CHAPTERS} from '../data/story';

/**
 * Where the persistent objects are at any second of the story. Every camera move in the
 * video is one of these tracks; chapters only decide which overlays are drawn on top.
 */
const C = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<string, {t0: number; t1: number}>;
export const T = {
  weld: C.weld, fast: C.fast, vision: C.vision, disagree: C.disagree, reason: C.reason, cause: C.cause, memory: C.memory, training: C.training, loop: C.loop,
};

export const FULL: Rect = {x: 0, y: 0, w: 1920, h: 1080};

/** Arc footage: full bleed while welding, then pulled to the top-left so the traces get white ground. */
export const videoRect = (t: number): Rect => rectTrack(t, [[T.fast.t0, FULL], [T.fast.t0 + 1.5, {x: 0, y: 0, w: 960, h: 540}]]);

/** Log-time window shown by the trace lanes in chapters 1–2 (whole weld) and later. */
export const LANE_T: [number, number] = [0, 40];
export const CHANNELS = [
  {key: 'current_A', unit: 'A', v: [0, 340] as [number, number]},
  {key: 'voltage_V', unit: 'V', v: [0, 45] as [number, number]},
  {key: 'feed_mm_min', unit: 'mm/min', v: [0, 180] as [number, number]},
] as const;

/** Geometry of the three lanes (current first). Chapter 3 keeps only a thin current strip. */
export const laneRects = (t: number): {lanes: Lane[]; opacity: number[]; ink: string; unitOpacity: number} => {
  const a = T.fast.t0;
  const x = track(t, [[a, 96], [a + 1.5, 96], [T.disagree.t0, 96], [T.disagree.t0 + 1.5, 160]]);
  const w = track(t, [[a, 1920 - 96 - 96 - 150], [a + 1.5, 1580], [T.disagree.t0, 1580], [T.disagree.t0 + 1.5, 1600]]);
  const laneH = track(t, [[a, 62], [a + 1.5, 104]]);
  const gap = track(t, [[a, 24], [a + 1.5, 36]]);
  const top = track(t, [[a, 1080 - 3 * (62 + 24) - 30], [a + 1.5, 596]]);
  const onDark = t < a + 0.75 || (t >= T.vision.t0 && t < T.disagree.t0 + 0.5);
  const ink = onDark ? 'rgba(255,255,255,0.92)' : tokens.ink;
  const inVision = t >= T.vision.t0;
  if (!inVision) {
    const lanes: Lane[] = CHANNELS.map((c, i) => ({x, y: top + i * (laneH + gap), w, h: laneH, tRange: LANE_T, vRange: c.v}));
    return {lanes, opacity: [1, 1, 1], ink, unitOpacity: 1};
  }
  // after the cut to the photo: the current lane is a thin strip at the bottom, then rises into
  // the split view; the voltage lane joins it there (the reasoning tests both), feed stays hidden
  const d = T.disagree.t0;
  const r = T.reason.t0;
  const lx = track(t, [[d, 96], [d + 1.5, 160]]);
  const lw = track(t, [[d, 1580], [d + 1.5, 1600]]);
  const cur: Lane = {
    x: lx, w: lw,
    y: track(t, [[d, 1000], [d + 1.5, 640], [r, 640], [r + 1, 690]]),
    h: track(t, [[d, 56], [d + 1.5, 250], [r, 250], [r + 1, 190]]),
    tRange: LANE_T, vRange: CHANNELS[0].v,
  };
  const volt: Lane = {
    x: lx, w: lw,
    y: track(t, [[d, 1120], [d + 1.5, 912], [r, 912], [r + 1, 905]]),
    h: 100,
    tRange: LANE_T, vRange: CHANNELS[1].v,
  };
  const feed: Lane = {x: lx, w: lw, y: 1200, h: 60, tRange: LANE_T, vRange: CHANNELS[2].v};
  const curOp = track(t, [[T.vision.t0, 0.55], [d, 0.55], [d + 1, 1], [T.memory.t0, 1], [T.memory.t0 + 0.8, 0]]);
  const voltOp = track(t, [[d + 0.4, 0], [d + 1.5, 1], [T.memory.t0, 1], [T.memory.t0 + 0.8, 0]]);
  return {lanes: [cur, volt, feed], opacity: [curOp, voltOp, 0], ink, unitOpacity: track(t, [[d + 0.8, 0], [d + 1.5, 1], [T.memory.t0, 1], [T.memory.t0 + 0.5, 0]])};
};

/** Bead framings of the 2000×900 front photo for each photo-box aspect. */
export const VIEW_PLATE: View = {x: 470, y: 45, w: 1040, h: 585};
export const VIEW_BEAD_16x9: View = {x: 620, y: 128, w: 740, h: 416};
export const VIEW_BEAD_SPLIT: View = {x: 600, y: 229, w: 780, h: 163}; // 1920×400
export const VIEW_BEAD_BAND: View = {x: 600, y: 240, w: 780, h: 138}; // 1920×340
export const VIEW_THUMB: View = {x: 560, y: 128, w: 860, h: 387}; // 400×180 thumbnails (2.22:1)

/** The hero photo: full frame in chapter 3, a band above the trace in 4–6, a thumbnail in 7. */
export const photoRect = (t: number): Rect =>
  rectTrack(t, [
    [T.disagree.t0, FULL],
    [T.disagree.t0 + 1.5, {x: 0, y: 0, w: 1920, h: 400}],
    [T.reason.t0, {x: 0, y: 0, w: 1920, h: 400}],
    [T.reason.t0 + 1, {x: 0, y: 0, w: 1920, h: 340}],
    [T.memory.t0, {x: 0, y: 0, w: 1920, h: 340}],
    [T.memory.t0 + 1.5, HERO_THUMB],
  ]);
/** 4×2 grid of the operator's welds (chapter 7): 400×180 thumbnails; the hero lands in the last slot. */
export const GRID = {x0: 100, y0: 330, w: 400, h: 180, gapX: 40, rowGap: 80};
export const gridSlot = (i: number): Rect => ({x: GRID.x0 + (i % 4) * (GRID.w + GRID.gapX), y: GRID.y0 + Math.floor(i / 4) * (GRID.h + GRID.rowGap), w: GRID.w, h: GRID.h});
export const HERO_THUMB: Rect = gridSlot(7);

const lerpView = (a: View, b: View, k: number): View => ({x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k});
export const photoView = (t: number): View => {
  const v = T.vision.t0;
  if (t < T.disagree.t0) {
    // slow drift on the plate, then the push-in to the bead once the mask is on
    const k1 = track(t, [[v, 0], [v + 3.5, 0.06]]);
    const k2 = track(t, [[v + 6, 0], [v + 8.5, 1]]);
    return lerpView(lerpView(VIEW_PLATE, VIEW_BEAD_16x9, k1), VIEW_BEAD_16x9, k2);
  }
  const k4 = track(t, [[T.disagree.t0, 0], [T.disagree.t0 + 1.5, 1]]);
  const k5 = track(t, [[T.reason.t0, 0], [T.reason.t0 + 1, 1]]);
  const k7 = track(t, [[T.memory.t0, 0], [T.memory.t0 + 1.5, 1]]);
  return lerpView(lerpView(lerpView(VIEW_BEAD_16x9, VIEW_BEAD_SPLIT, k4), VIEW_BEAD_BAND, k5), VIEW_THUMB, k7);
};
