import type {SceneDef} from '../lib/scene';
import {LiveSensing} from './01-LiveSensing';
import {FastProcess} from './02-FastProcess';
import {PostWeldVision} from './03-PostWeldVision';
import {Disagreement} from './04-Disagreement';
import {Reasoning} from './05-Reasoning';
import {RootCauseAction} from './06-RootCauseAction';
import {Vision} from './07-Vision';

/** The storyboard. Order, duration and notes live here; visuals live in the scene files. */
export const SCENES: SceneDef[] = [
  {
    id: 'live-sensing', n: 1, title: 'Welding + live process sensing', durationSec: 10,
    message: 'A weld is filmed and logged at the same time.',
    notes: [
      'Real arc video of weld 03-15-23-0080-05 fills the frame (dataset AVI, transcoded).',
      'Current, voltage, wire feed and gas write themselves in sync with the footage, 2.85× real time.',
      'No model yet: light ink only. Counter = log time.',
      'Borrowed: CoTracker signal-as-trail; DINOv2 zero words.',
    ],
    keyframes: [{at: 0.12, label: 'ignition'}, {at: 0.55, label: 'mid weld'}, {at: 0.95, label: 'arc off'}],
    Component: LiveSensing,
  },
  {
    id: 'fast-process', n: 2, title: 'Fast process inference', durationSec: 6,
    message: 'The fast layer reads the log and stamps its finding on the trace.',
    notes: [
      'Hard cut to white; the whole weld log stands alone.',
      'One read-head sweep; the plateau is banded on current and voltage; measured value beside the chip.',
      'Wire feed and gas carry no finding and stay untouched (AnomalyGPT "black = nothing").',
      'Borrowed: SEEM scribble→fill; VisProg value substitution; Cutie stamp.',
    ],
    keyframes: [{at: 0.3, label: 'read head'}, {at: 0.9, label: 'finding'}],
    Component: FastProcess,
  },
  {
    id: 'post-weld-vision', n: 3, title: 'Post-weld visual inference', durationSec: 8,
    message: 'The fast layer finds the defect on the photo.',
    notes: [
      'Real front photo (label removed) fills the frame; the camera pushes in on the bead.',
      'Marker lands on the lower toe → region fills in 0.3 s → one-word chip. SAM 2 cadence, Grounded chip rule.',
      'The undercut region is ILLUSTRATIVE (a band along the lower toe per the teacher chain-of-evidence).',
    ],
    keyframes: [{at: 0.15, label: 'raw'}, {at: 0.27, label: 'marker'}, {at: 0.9, label: 'undercut'}],
    Component: PostWeldVision,
  },
  {
    id: 'disagreement', n: 4, title: 'Fast-flow disagreement', durationSec: 6,
    message: 'A defect with a steady process: the simple story does not fit.',
    notes: [
      'One camera move: the photo shrinks to the top, the current trace rises from below (MegaSaM hand-off).',
      'A line joins the defect to the steady plateau and carries one word: unexplained (ReKep).',
      'Router marks are ink; fast marks stay orange.',
    ],
    keyframes: [{at: 0.3, label: 'split'}, {at: 0.85, label: 'unexplained'}],
    Component: Disagreement,
  },
  {
    id: 'reasoning', n: 5, title: 'Neural-symbolic reasoning', durationSec: 12,
    message: 'kb-v1 causes of undercut are checked one by one against this weld.',
    notes: [
      'Cause words appear in the band between photo and trace, in the order tested: arc instability, welding current, travel speed, gun angle.',
      'Each sends a line to its evidence; the check is the substituted value; the line state is the verdict (solid / dotted / dashed-grey).',
      'The qualified window 119–182 A (p5–p95 of 140 good welds) is drawn on the trace when welding current is tested.',
      'Ranking = the supported word grows, the others recede (Hume). No graph, no cards.',
      'Word count on the final frame is the densest in the video; review candidate for cuts.',
    ],
    keyframes: [{at: 0.2, label: 'arc instability'}, {at: 0.52, label: 'welding current'}, {at: 0.68, label: 'travel speed'}, {at: 0.85, label: 'gun angle'}, {at: 0.97, label: 'ranked'}],
    Component: Reasoning,
  },
  {
    id: 'root-cause-action', n: 6, title: 'Root cause → welder training', durationSec: 8,
    message: 'The supported cause becomes a correction, and the correction is seen working.',
    notes: [
      'The window becomes the target; the cause word becomes the recommendation bar; the setpoint 300 A is struck through.',
      'A real good weld (02-17-23-0106-00, 135 A) writes its trace inside the window while its photo wipes in (Cutie wipe).',
      'Only sentence in the video: reduce welding current. Training wording is open for review.',
    ],
    keyframes: [{at: 0.2, label: 'target'}, {at: 0.5, label: 'recommendation'}, {at: 0.97, label: 'next weld'}],
    Component: RootCauseAction,
  },
  {
    id: 'vision', n: 7, title: 'Research vision', durationSec: 6,
    message: 'Sense, perceive, reason, act: one loop over real welds.',
    notes: [
      'Four live thumbnails of the scenes just watched (not icons), one word each; the title arrives last.',
      'No architecture diagram (ReKep / SAM 2 recap rule).',
    ],
    keyframes: [{at: 0.35, label: 'loop'}, {at: 0.9, label: 'title'}],
    Component: Vision,
  },
];

export const sceneById = (id: string): SceneDef => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`unknown scene ${id}`);
  return s;
};
export const sceneByN = (n: number): SceneDef => SCENES[Math.min(SCENES.length, Math.max(1, n)) - 1];
