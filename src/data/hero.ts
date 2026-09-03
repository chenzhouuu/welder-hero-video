import signalsJson from './hero-signals.json';
import caseJson from './hero-case.json';

/** Six-channel process log of weld 03-15-23-0080-05 (309 rows, 0.116 s). */
export type Signals = {
  part_no: string;
  sampling_s: number;
  n_rows: number;
  arc_on_rows: [number, number];
  t: number[];
  current_A: number[];
  voltage_V: number[];
  feed_mm_min: number[];
  gas_L_min: number[];
  pressure_bar: number[];
  wire_mm: number[];
};
export const signals = signalsJson as Signals;
export const heroCase = caseJson;

/** Arc-on window in log seconds (rows 55–264). */
export const ARC_ON_S: [number, number] = [signals.t[signals.arc_on_rows[0]], signals.t[signals.arc_on_rows[1]]];
/** Plateau used for the fast process statistics (rows 65–254). */
export const PLATEAU_ROWS: [number, number] = [65, 254];
export const PLATEAU = {current_A: 279.3, current_cv: 0.039, voltage_V: 17.4, voltage_cv: 0.028, feed_mm_min: 127, gas_L_min: 13.9};
/** p5–p95 of per-weld arc-on mean current over 140 good fillet Fe410 welds. */
export const GOOD_WINDOW_A: [number, number] = [119, 182];
export const GOOD_WINDOW_V: [number, number] = [17.5, 22.3];

/**
 * Arc video ↔ process log alignment. The AVI (960×600, 30 fps, 34.77 s) brightens at
 * 6.1 s and darkens at 29.5 s (frame brightness at 10 fps); the log's arc-on window is
 * 6.38–30.62 s. Linear map measured 2026-09-02; frame-exact check before the final render.
 */
export const VIDEO_T0 = 6.1;
export const VIDEO_SCALE = 0.965;
export const logToVideoS = (tLog: number): number => VIDEO_T0 + (tLog - ARC_ON_S[0]) * VIDEO_SCALE;
export const ARC_VIDEO = 'hero/arc_03-15-23-0080-05.webm';
export const ARC_VIDEO_SIZE = {w: 960, h: 600};

/** Photos (label removed). */
export const PHOTO_FRONT = 'hero/plate_front_full.jpg'; // 2000×900
export const PHOTO_FRONT_SIZE = {w: 2000, h: 900};
export const PHOTO_OBLIQUE = 'hero/plate_oblique.jpg'; // 1000×700
export const BEAD_OBLIQUE = 'hero/bead_oblique.jpg'; // 361×405
/** Hand-picked gold bead box on the 2000×900 front photo (run200 idx 180). */
export const BEAD_BOX_FRONT = {x0: 668.9, y0: 268.5, x1: 1283.7, y1: 348.9};
