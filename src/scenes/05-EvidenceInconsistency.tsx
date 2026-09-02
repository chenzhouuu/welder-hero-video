import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {ObservationToken} from '../components/ObservationToken';
import {Panel, RouterBadge} from '../components/Cards';
import {Body, Kicker, Title} from '../components/Text';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_05 = 252;

const Cell: React.FC<{children: React.ReactNode; color?: string; opacity?: number; strike?: boolean}> = ({children, color = colors.text, opacity = 1, strike = false}) => (
  <div style={{fontFamily: fonts.mono, fontSize: 25, color, opacity, letterSpacing: '0.04em', textDecoration: strike ? 'line-through' : undefined, fontWeight: 600}}>{children}</div>
);

/** Scene 5 — disagreement between semantic observations is the trigger for reasoning. */
export const EvidenceInconsistency: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slow = frame >= 172;
  const mismatch = fadeIn(frame, 108, 12);
  return (
    <SceneShell duration={DUR_05} temperature={0.5 + 0.4 * ramp(frame, 170, 250)}>
      <div style={{position: 'absolute', left: 96, top: 84}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>disagreement as a reasoning trigger</Kicker>
      </div>

      {/* the two observations */}
      <div style={{position: 'absolute', left: 96, right: 96, top: 160, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <ObservationToken k="product quality" v="ABNORMAL" tone="abnormal" size="lg" appear={pop(frame, fps, 6)} sub="visual sentinel · undercut at the weld toe" style={{transform: 'scale(1.25)', transformOrigin: 'left center'}} />
        <div style={{fontFamily: fonts.mono, fontSize: 26, color: colors.textDim, opacity: fadeIn(frame, 30)}}>versus</div>
        <ObservationToken k="process integrity" v="NOMINAL" tone="nominal" size="lg" appear={pop(frame, fps, 18)} sub="process sentinel · stable arc, steady current and voltage, gas flowing" style={{transform: 'scale(1.25)', transformOrigin: 'right center'}} />
      </div>

      {/* simple-hypothesis test */}
      <div style={{position: 'absolute', left: 96, top: 330, width: 1728}}>
        <Panel appear={fadeIn(frame, 48)} accent={colors.symbolic} style={{padding: '22px 30px'}}>
          <Kicker color={colors.symbolic} size={13}>
            simplest explanation
          </Kicker>
          <div style={{fontFamily: fonts.sans, fontSize: 30, color: colors.text, marginTop: 8}}>“Electrical process instability caused the defect.”</div>
          <div style={{display: 'grid', gridTemplateColumns: '220px 1fr 80px 1fr', columnGap: 24, rowGap: 14, marginTop: 22, alignItems: 'center'}}>
            <Kicker size={13} color={colors.symbolic} style={{opacity: fadeIn(frame, 70)}}>
              would predict
            </Kicker>
            <Cell opacity={fadeIn(frame, 76)}>PRODUCT · ABNORMAL</Cell>
            <Cell color={colors.textDim} opacity={fadeIn(frame, 80)}>
              and
            </Cell>
            <Cell opacity={fadeIn(frame, 84)}>PROCESS · ABNORMAL</Cell>

            <Kicker size={13} color={colors.neural} style={{opacity: fadeIn(frame, 94)}}>
              observed
            </Kicker>
            <Cell color={colors.abnormal} opacity={fadeIn(frame, 98)}>
              PRODUCT · ABNORMAL ✓
            </Cell>
            <Cell color={colors.textDim} opacity={fadeIn(frame, 100)}>
              and
            </Cell>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <Cell color={colors.nominal} opacity={fadeIn(frame, 102)}>
                PROCESS · NOMINAL
              </Cell>
              <div style={{fontFamily: fonts.mono, fontSize: 26, color: colors.weakened, fontWeight: 800, opacity: mismatch, transform: `scale(${0.6 + 0.4 * mismatch})`}}>✗ mismatch</div>
            </div>
          </div>
        </Panel>
      </div>

      <div style={{position: 'absolute', left: 96, top: 640}}>
        <Title size={52} color={colors.neural} style={{opacity: fadeIn(frame, 118), transform: `translateY(${(1 - fadeIn(frame, 118)) * 10}px)`}}>
          Evidence inconsistency.
        </Title>
        <Body size={24} style={{marginTop: 8, opacity: fadeIn(frame, 138)}}>
          The observations cannot be explained by the simplest hypothesis. The defect is real, and the process did what it was told.
        </Body>
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 150, opacity: fadeIn(frame, 160)}}>
        <RouterBadge mode={slow ? 'slow' : 'fast'} blend={slow ? fadeIn(frame, 172, 10) : 1} />
        <div style={{display: 'flex', gap: 30, marginTop: 12, opacity: fadeIn(frame, 178)}}>
          <Kicker size={14} color={colors.textDim}>
            sufficient → archive · monitor
          </Kicker>
          <Kicker size={14} color={colors.symbolicSoft}>
            abnormal · uncertain · high-risk · contradictory → reason
          </Kicker>
        </div>
      </div>

      <div style={{position: 'absolute', right: 96, bottom: 120, textAlign: 'right', opacity: fadeIn(frame, 190)}}>
        <Kicker size={18} color={colors.neural}>
          fast neural perception
        </Kicker>
        <div style={{fontSize: 30, color: colors.textDim, lineHeight: 1}}>↓</div>
        <Kicker size={18} color={colors.symbolic}>
          slow symbolic reasoning
        </Kicker>
      </div>
    </SceneShell>
  );
};
