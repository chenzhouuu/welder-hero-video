import s1 from './02-17-23-0101-00-signals.json';
import s2 from './02-17-23-0102-00-signals.json';
import s3 from './02-17-23-0103-00-signals.json';
import s4 from './02-17-23-0104-00-signals.json';
import s5 from './02-17-23-0105-00-signals.json';
import s6 from './02-17-23-0106-00-signals.json';
import s7 from './02-17-23-0108-00-signals.json';
import s8 from './02-17-23-0109-00-signals.json';
import type {Signals} from './hero';

/**
 * Eight real good welds (good_weld_6_02-17-23_Fe410, parts 0101–0106, 0108, 0109) whose logs
 * pass the fast process check in chapter 2 under illustrative IDs Weld 079–086.
 */
export const tickerSignals: Signals[] = [s1, s2, s3, s4, s5, s6, s7, s8] as Signals[];
