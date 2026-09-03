import type {SceneDef} from '../lib/scene';
import {Story} from '../story/Story';
import {CHAPTERS, REVIEW_KEYFRAMES, TOTAL_S} from '../data/story';

/**
 * The storyboard is one continuous scene: one weld through the whole system. Chapters are
 * review anchors on the same timeline (src/data/story.ts), not separate compositions.
 */
export const SCENES: SceneDef[] = [
  {
    id: 'story',
    n: 1,
    title: 'One weld through WELDER',
    durationSec: TOTAL_S,
    message: 'The viewer watches one weld move through the system: sensing, fast checks, a disagreement, mechanism reasoning, memory, training, and the loop at scale.',
    notes: [
      'Continuous timeline; the footage, the traces, the photo and the two fast findings persist and move between chapters (src/story/layout.ts).',
      'Hard cuts only at 21 s (footage → photo) and 82 s (training → loop); chapter 8 grows out of chapter 7.',
      'No layer stamps: fast = continuous orange screening, slow = selective blue reasoning.',
      'Numbers on screen: SAM 3.1 bead score, log clock, the qualified window 119–182 A (once, chapter 5). Everything else is words on the data.',
      'Fast finding is worded for what the monitor measures: process stable (stability, transients, dropouts), never "nominal" or "optimal".',
      'Timing is provisional: review story, composition and meaning; motion is finalised after design freeze.',
    ],
    keyframes: REVIEW_KEYFRAMES.map((k) => ({at: k.at / TOTAL_S, label: k.label})),
    chapters: CHAPTERS.map((c) => ({n: c.n, at: c.t0, title: c.title, message: c.message})),
    Component: Story,
  },
];

export const sceneById = (id: string): SceneDef => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`unknown scene ${id}`);
  return s;
};
export const sceneByN = (n: number): SceneDef => SCENES[Math.min(SCENES.length, Math.max(1, n)) - 1];
