/**
 * The continuous story: one weld through the whole system. Absolute seconds on a single
 * timeline; chapters are review anchors, not cuts. Durations are provisional until the
 * story review — they are chosen for legibility, not final pacing.
 */
export type Chapter = {id: string; n: number; t0: number; t1: number; title: string; message: string};

export const CHAPTERS: Chapter[] = [
  {id: 'weld', n: 1, t0: 0, t1: 12, title: 'The weld', message: 'This physical event is producing a digital trace.'},
  {id: 'fast', n: 2, t0: 12, t1: 21, title: 'Fast process monitoring', message: 'Every weld is screened online, continuously, at low cost.'},
  {id: 'vision', n: 3, t0: 21, t1: 32, title: 'Post-weld visual inference', message: 'The same weld is inspected; a vision model finds undercut.'},
  {id: 'disagree', n: 4, t0: 32, t1: 39, title: 'Fast QC · disagreement', message: 'Undercut on a stable process: perception alone cannot explain it.'},
  {id: 'reason', n: 5, t0: 39, t1: 56, title: 'Neural-symbolic reasoning', message: 'Knowledge proposes mechanisms; each reaches back into the evidence and tests itself.'},
  {id: 'cause', n: 6, t0: 56, t1: 61, title: 'Root-cause hypothesis', message: 'The graph collapses into a likely mechanism and one also-consistent one, still pointing at the evidence.'},
  {id: 'memory', n: 7, t0: 61, t1: 72, title: 'Manufacturing memory', message: 'One diagnosis becomes a record among the operator\'s welds; repeated records become a pattern.'},
  {id: 'training', n: 8, t0: 72, t1: 82, title: 'Welder training', message: 'Repeated pattern → training focus → recommended practice: inspection becomes feedback.'},
  {id: 'loop', n: 9, t0: 82, t1: 90, title: 'Enterprise fast/slow loop', message: 'Fast screening for all welds. Deep reasoning only when needed.'},
];
export const TOTAL_S = CHAPTERS[CHAPTERS.length - 1].t1;
export const chapterAt = (t: number): Chapter => CHAPTERS.find((c) => t < c.t1) ?? CHAPTERS[CHAPTERS.length - 1];

/** Review keyframes (absolute seconds). */
export const REVIEW_KEYFRAMES: {at: number; label: string}[] = [
  {at: 7.5, label: 'live welding + signals'},
  {at: 17.5, label: 'fast process inference'},
  {at: 25.5, label: 'bead grounding + mask'},
  {at: 30.5, label: 'undercut'},
  {at: 37.5, label: 'disagreement'},
  {at: 45.0, label: 'arc instability weakened'},
  {at: 50.0, label: 'heat input plausible'},
  {at: 55.0, label: 'torch / travel likely'},
  {at: 59.0, label: 'likely mechanism'},
  {at: 64.5, label: 'operator history'},
  {at: 70.5, label: 'recurring pattern'},
  {at: 79.5, label: 'training'},
  {at: 86.0, label: 'enterprise loop'},
];

/** Illustrative traceability labels (the dataset has no operator or weld-number fields; see provenance.json). */
export const LABELS = {weld: 'Weld 087', operator: 'Operator W017'} as const;
/** Earlier welds passing the fast check in chapter 2 (real good-weld logs, illustrative IDs). */
export const TICKER_WELDS = ['Weld 079', 'Weld 080', 'Weld 081', 'Weld 082', 'Weld 083', 'Weld 084', 'Weld 085', 'Weld 086'] as const;
export const LOOP_WELDS = ['Weld 088', 'Weld 089', 'Weld 090', 'Weld 091', 'Weld 092', 'Weld 093', 'Weld 094', 'Weld 095'] as const;
/** The fast process finding, worded for what the monitor measures (stability, transients, dropouts). */
export const FAST_FINDING = 'process stable';

/** Footage/log time base for chapters 1–2: log seconds shown at t = 0 and log seconds per story second. */
export const LOG_T0 = 3.5;
export const LOG_SPEED = 1.4;
export const tLogAt = (t: number): number => LOG_T0 + t * LOG_SPEED;
/** Length of the fast monitor's sliding window, in log seconds. */
export const WINDOW_S = 4;

/**
 * The three mechanisms the slow layer tests, in the order tested. Sources are kb-v1 cause
 * edges into UNDERCUT (hero-case.json symbolic_knowledge). `expects` is the symbolic
 * relation drawn on the edge (mechanism → expected evidence); the verdict is intended system
 * behaviour, derived from the measured evidence the edge lands on.
 */
export type Hypothesis = {id: string; name: string; expects: string; verdict: 'weakened' | 'plausible' | 'likely'; kb: string};
export const HYPOTHESES: Hypothesis[] = [
  {id: 'H1', name: 'arc instability', expects: 'erratic I / V', verdict: 'weakened', kb: 'kb-v1 has no ARC INSTABILITY → UNDERCUT edge; an unstable arc would show in the traces'},
  {id: 'H2', name: 'heat input', expects: 'level above qualified window', verdict: 'plausible', kb: 'WELDING CURRENT (w8), EXCESSIVE VOLTAGE (w9) → UNDERCUT'},
  {id: 'H3', name: 'torch / travel', expects: 'one-sided toe groove', verdict: 'likely', kb: 'INCORRECT GUN ANGLE (w9), TRAVEL SPEED TOO FAST (w9) → UNDERCUT'},
];
