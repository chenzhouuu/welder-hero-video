import React from 'react';
import {AbsoluteFill, Composition, Sequence, useCurrentFrame} from 'remotion';
import {loadFonts} from './lib/fonts';
import {colors} from './styles/tokens';
import {Chrome} from './components/Text';
import {DISCLOSURE} from './data/case';
import {ManufacturingWorld, DUR_01} from './scenes/01-ManufacturingWorld';
import {MultimodalSensing, DUR_02} from './scenes/02-MultimodalSensing';
import {NeuralPerception, DUR_03} from './scenes/03-NeuralPerception';
import {NeuralSymbolicBridge, DUR_04} from './scenes/04-NeuralSymbolicBridge';
import {EvidenceInconsistency, DUR_05} from './scenes/05-EvidenceInconsistency';
import {SymbolicKnowledge, DUR_06} from './scenes/06-SymbolicKnowledge';
import {MechanismReasoning, DUR_07} from './scenes/07-MechanismReasoning';
import {Explanation, DUR_08} from './scenes/08-Explanation';
import {TraceabilityMemory, DUR_09} from './scenes/09-TraceabilityMemory';
import {HumanFeedback, DUR_10} from './scenes/10-HumanFeedback';
import {SmartManufacturingVision, DUR_11} from './scenes/11-SmartManufacturingVision';
import {fadeIn, ramp} from './lib/anim';

loadFonts();

/** Scene table: each scene overlaps the next by OVERLAP frames (its own exit fade). */
const OVERLAP = 12;
export const SCENES: {id: string; comp: React.FC; dur: number}[] = [
  {id: '01-world', comp: ManufacturingWorld, dur: DUR_01},
  {id: '02-sensing', comp: MultimodalSensing, dur: DUR_02},
  {id: '03-perception', comp: NeuralPerception, dur: DUR_03},
  {id: '04-bridge', comp: NeuralSymbolicBridge, dur: DUR_04},
  {id: '05-inconsistency', comp: EvidenceInconsistency, dur: DUR_05},
  {id: '06-knowledge', comp: SymbolicKnowledge, dur: DUR_06},
  {id: '07-reasoning', comp: MechanismReasoning, dur: DUR_07},
  {id: '08-explanation', comp: Explanation, dur: DUR_08},
  {id: '09-memory', comp: TraceabilityMemory, dur: DUR_09},
  {id: '10-feedback', comp: HumanFeedback, dur: DUR_10},
  {id: '11-vision', comp: SmartManufacturingVision, dur: DUR_11},
];

export const sceneStarts = (): number[] => {
  const starts: number[] = [];
  let t = 0;
  for (const s of SCENES) {
    starts.push(t);
    t += s.dur - OVERLAP;
  }
  return starts;
};

export const TOTAL_FRAMES = sceneStarts()[SCENES.length - 1] + DUR_11;

export const WelderHero: React.FC = () => {
  const frame = useCurrentFrame();
  const starts = sceneStarts();
  const s11 = starts[10];
  const disclosureOpacity = Math.min(fadeIn(frame, starts[2] + 20, 30), ramp(frame, s11 + 200, s11 + 214, 1, 0));
  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      {SCENES.map((s, i) => {
        const C = s.comp;
        return (
          <Sequence key={s.id} from={starts[i]} durationInFrames={s.dur} name={s.id}>
            <C />
          </Sequence>
        );
      })}
      {/* persistent brand; disclosure footer from scene 3 until the end card, which carries its own */}
      <Chrome disclosure={DISCLOSURE} disclosureOpacity={disclosureOpacity} />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="WelderHero" component={WelderHero} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
      {SCENES.map((s) => (
        <Composition key={s.id} id={`scene-${s.id}`} component={s.comp} durationInFrames={s.dur} fps={30} width={1920} height={1080} />
      ))}
    </>
  );
};
