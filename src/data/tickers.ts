import s1 from './02-17-23-0101-00-signals.json';
import s2 from './02-17-23-0102-00-signals.json';
import s3 from './02-17-23-0103-00-signals.json';
import type {Signals} from './hero';

/**
 * Three real good welds (good_weld_6_02-17-23_Fe410, parts 0101–0103) whose logs pass the
 * fast process check in chapter 2 under illustrative IDs Weld 084–086.
 */
export const tickerSignals: Signals[] = [s1 as Signals, s2 as Signals, s3 as Signals];
