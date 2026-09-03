/**
 * The continuous story: one weld through the whole system. Absolute seconds on a single
 * timeline; chapters are review anchors, not cuts. Durations are provisional until the
 * story review — they are chosen for legibility, not final pacing.
 */
export type Chapter = {id: string; n: number; t0: number; t1: number; title: string; message: string};

export const CHAPTERS: Chapter[] = [
  {id: 'weld', n: 1, t0: 0, t1: 12, title: 'The weld', message: 'This physical event is producing a digital trace.'},
  {id: 'fast', n: 2, t0: 12, t1: 21, title: 'Fast process monitoring', message: 'Every weld is screened online, at low cost.'},
  {id: 'vision', n: 3, t0: 21, t1: 33, title: 'Post-weld visual inference', message: 'The same weld is inspected; a vision model finds undercut.'},
  {id: 'disagree', n: 4, t0: 33, t1: 41, title: 'Fast QC · disagreement', message: 'Product abnormal, process nominal: perception alone cannot explain it.'},
  {id: 'reason', n: 5, t0: 41, t1: 58, title: 'Neural-symbolic reasoning', message: 'Manufacturing knowledge proposes mechanisms; each is tested against the evidence.'},
  {id: 'cause', n: 6, t0: 58, t1: 64, title: 'Root-cause hypothesis', message: 'The graph collapses into a likely mechanism, still pointing at the evidence.'},
  {id: 'memory', n: 7, t0: 64, t1: 73, title: 'Manufacturing memory', message: 'One diagnosis becomes a record; repeated records become a pattern.'},
  {id: 'training', n: 8, t0: 73, t1: 81, title: 'Welder training', message: 'Inspection → diagnosis → feedback to the person.'},
  {id: 'loop', n: 9, t0: 81, t1: 88, title: 'Enterprise fast/slow loop', message: 'Fast for all. Deep reasoning when needed.'},
];
export const TOTAL_S = CHAPTERS[CHAPTERS.length - 1].t1;
export const chapterAt = (t: number): Chapter => CHAPTERS.find((c) => t < c.t1) ?? CHAPTERS[CHAPTERS.length - 1];

/** Review keyframes (absolute seconds) requested for the story review. */
export const REVIEW_KEYFRAMES: {at: number; label: string}[] = [
  {at: 7.5, label: 'live welding + signals'},
  {at: 18.0, label: 'fast process inference'},
  {at: 26.5, label: 'bead grounding + mask'},
  {at: 31.5, label: 'undercut'},
  {at: 39.5, label: 'disagreement'},
  {at: 56.5, label: 'hypothesis reasoning'},
  {at: 62.0, label: 'likely mechanism'},
  {at: 71.5, label: 'operator pattern'},
  {at: 79.5, label: 'training'},
  {at: 84.5, label: 'enterprise loop'},
];

/** Illustrative traceability labels (the dataset has no operator or weld-number fields; see provenance.json). */
export const LABELS = {weld: 'Weld 087', operator: 'Operator W017'} as const;
export const TICKER_WELDS = ['Weld 084', 'Weld 085', 'Weld 086'] as const;
export const LOOP_WELDS = ['Weld 088', 'Weld 089', 'Weld 090', 'Weld 091', 'Weld 092'] as const;

/** Footage/log time base for chapters 1–2: log seconds shown at t = 0 and log seconds per story second. */
export const LOG_T0 = 3.5;
export const LOG_SPEED = 1.4;
export const tLogAt = (t: number): number => LOG_T0 + t * LOG_SPEED;
/** Length of the fast monitor's sliding window, in log seconds. */
export const WINDOW_S = 4;

/**
 * The three mechanisms the slow layer tests, in the order tested. Sources are kb-v1 cause
 * edges into UNDERCUT (see hero-case.json symbolic_knowledge); verdicts are intended system
 * behaviour, derived from the measured evidence named in `observed`.
 */
export type Hypothesis = {id: string; name: string; expects: string; observed: string; verdict: 'weakened' | 'consistent'; kb: string};
export const HYPOTHESES: Hypothesis[] = [
  {id: 'H1', name: 'arc instability', expects: 'erratic current or voltage', observed: 'current steady · voltage steady', verdict: 'weakened', kb: 'kb-v1 has no ARC INSTABILITY → UNDERCUT edge; an unstable arc would show in the traces'},
  {id: 'H2', name: 'torch angle / travel', expects: 'groove on one toe · traces unaffected', observed: 'lower-toe groove · traces steady', verdict: 'consistent', kb: 'INCORRECT GUN ANGLE (w9), TRAVEL SPEED TOO FAST (w9) → UNDERCUT'},
  {id: 'H3', name: 'heat input', expects: 'current or voltage above the joint window', observed: 'current above · voltage inside', verdict: 'consistent', kb: 'WELDING CURRENT (w8), EXCESSIVE VOLTAGE (w9) → UNDERCUT'},
];
