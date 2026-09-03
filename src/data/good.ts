import goodJson from './02-17-23-0106-00-signals.json';
import type {Signals} from './hero';

/**
 * Reference good weld: good_weld_6_02-17-23_Fe410/02-17-23-0106-00 (VAL). Chosen from the 140
 * good fillet Fe410 welds as the one whose arc-on mean current (134.8 A) sits nearest the
 * reference-window centre with a low CV (0.06). Shown in scene 6 as "what a weld inside the
 * window looks like" — real data, no claim that it followed a recommendation.
 */
export const good = goodJson as Signals;
export const GOOD_PHOTO = 'hero/good_front_full.jpg'; // label removed, 2000×900
export const GOOD_PHOTO_SIZE = {w: 2000, h: 900};
/** Arc-on mean current of the good weld (docs/process_stats.csv). */
export const GOOD_PLATEAU_A = 134.8;
/** Nominal programmed current of the hero (undercut) weld, from the dataset manifest. */
export const GOOD_NOMINAL_A_HERO = 300;
