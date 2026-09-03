import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {ArchDiagram} from '../components/ArchDiagram';
import {Panel} from '../components/Cards';
import {Body, Kicker, ProvenanceTag, Title} from '../components/Text';
import {CASE, PLATEAU_A, WINDOW_A} from '../data/case';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, ramp} from '../lib/anim';

export const DUR_08 = 252;

/** Scene 8 — WHAT versus WHY. */
export const Explanation: React.FC = () => {
  const frame = useCurrentFrame();
  const left = [0, 1, 2].map((i) => fadeIn(frame, 18 + i * 14));
  const right = [0, 1, 2, 3, 4, 5].map((i) => fadeIn(frame, 76 + i * 14));
  const active = frame < 76 ? undefined : Math.min(5, Math.floor((frame - 76) / 14));
  return (
    <SceneShell duration={DUR_08} temperature={0.8}>
      <div style={{position: 'absolute', left: 96, top: 84}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>from prediction to explanation</Kicker>
      </div>

      <div style={{position: 'absolute', left: 96, top: 150, width: 520}}>
        <Kicker size={13} color={colors.textMuted} style={{opacity: fadeIn(frame, 10)}}>
          traditional neural inspection
        </Kicker>
        <Title size={34} style={{marginTop: 8, opacity: fadeIn(frame, 12)}}>
          Detection tells us <span style={{color: colors.neural}}>WHAT.</span>
        </Title>
        <div style={{marginTop: 40}}>
          <ArchDiagram width={520} height={130} stages={[{label: 'IMAGE', tone: 'input'}, {label: 'NEURAL NET', tone: 'neural'}, {label: 'UNDERCUT', tone: 'neural', sub: 'class label'}]} reveal={left} />
        </div>
        <Body size={21} style={{marginTop: 26, opacity: fadeIn(frame, 62)}}>
          A label, then silence. No mechanism, no rule, no action, no memory.
        </Body>
      </div>

      <div style={{position: 'absolute', left: 676, top: 150, width: 1148}}>
        <Kicker size={13} color={colors.symbolic} style={{opacity: fadeIn(frame, 66)}}>
          WELDER
        </Kicker>
        <Title size={34} style={{marginTop: 8, opacity: fadeIn(frame, 68)}}>
          Neural-symbolic reasoning investigates <span style={{color: colors.symbolic}}>WHY.</span>
        </Title>
        <div style={{marginTop: 40}}>
          <ArchDiagram
            width={1148}
            height={130}
            stages={[
              {label: 'IMAGE + PROCESS', tone: 'input'},
              {label: 'NEURAL PERCEPTION', tone: 'neural'},
              {label: 'STRUCTURED OBSERVATIONS', tone: 'bridge'},
              {label: 'SYMBOLIC KNOWLEDGE', tone: 'symbolic'},
              {label: 'MECHANISM HYPOTHESIS', tone: 'symbolic'},
              {label: 'ACTION', tone: 'output'},
            ]}
            reveal={right}
            active={active}
          />
        </div>
      </div>

      <div style={{position: 'absolute', left: 96, right: 96, top: 500}}>
        <Panel appear={fadeIn(frame, 150)} accent={colors.supported} style={{padding: '24px 30px'}}>
          <div style={{display: 'flex', gap: 16, alignItems: 'baseline'}}>
            <Kicker size={13} color={colors.supported}>
              likely root-cause hypothesis · mechanism-consistent explanation
            </Kicker>
            <ProvenanceTag kind="intended" />
          </div>
          <div style={{fontFamily: fonts.sans, fontSize: 30, color: colors.text, marginTop: 14, lineHeight: 1.32}}>
            Heat input above the qualified window ({PLATEAU_A.toFixed(0)} A against {WINDOW_A[0]}–{WINDOW_A[1]} A) with a stable arc. The toe groove is consistent with the knowledge-base edge WELDING CURRENT → UNDERCUT.
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 18}}>
            <Body size={20} style={{opacity: fadeIn(frame, 180)}}>
              <span style={{color: colors.plausible, fontFamily: fonts.mono, fontSize: 13, letterSpacing: '0.14em'}}>OPEN</span> Travel-speed and torch-angle contributions cannot be separated without travel-position or angle sensing.
            </Body>
            <Body size={18} color={colors.textDim} style={{opacity: fadeIn(frame, 196)}}>
              Teacher record, verbatim: “{CASE.reasoning.teacher_uncertainty}”
            </Body>
          </div>
        </Panel>
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 70, display: 'flex', gap: 30, alignItems: 'baseline', opacity: fadeIn(frame, 224)}}>
        <Kicker size={14} color={colors.neural}>
          what
        </Kicker>
        <span style={{color: colors.textDim}}>→</span>
        <Kicker size={14} color={colors.symbolic}>
          why
        </Kicker>
        <span style={{color: colors.textDim}}>→</span>
        <Kicker size={14} color={colors.supported}>
          what to do next
        </Kicker>
        <Kicker size={12} color={colors.textDim} style={{marginLeft: 20}}>
          a hypothesis with its evidence, never a proof of cause
        </Kicker>
      </div>
      <div style={{position: 'absolute', right: 96, bottom: 70, opacity: ramp(frame, 224, 240)}}>
        <Kicker size={12} color={colors.textDim}>
          neural = perception · symbolic = knowledge and rules · together = explanation
        </Kicker>
      </div>
    </SceneShell>
  );
};
