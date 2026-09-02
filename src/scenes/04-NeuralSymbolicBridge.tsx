import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {ObservationToken} from '../components/ObservationToken';
import {WeldImage} from '../components/WeldImage';
import {SignalStream} from '../components/SignalStream';
import {Body, Kicker, Title} from '../components/Text';
import {CASE, SIGNALS, PLATEAU_A, VOLT_MEAN, FEED_MEAN, GAS_MEAN} from '../data/case';
import {colors} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_04 = 222;

/** Scene 4 — the interface: an inspectable intermediate representation. */
export const NeuralSymbolicBridge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ghost = 0.12 * (1 - ramp(frame, 150, 210));
  const ctx = CASE.raw_data.context;
  const groups: {title: string; tone: 'abnormal' | 'nominal' | 'cool' | 'neutral'; items: [string, string][]}[] = [
    {
      title: 'visual',
      tone: 'abnormal',
      items: [
        ['DEFECT', 'UNDERCUT'],
        ['LOCATION', 'WELD TOE'],
        ['MORPHOLOGY', 'TOE GROOVE'],
      ],
    },
    {
      title: 'process',
      tone: 'nominal',
      items: [
        ['ARC STABILITY', 'NOMINAL'],
        ['CURRENT', `STEADY · ${PLATEAU_A.toFixed(0)} A`],
        ['VOLTAGE', `STEADY · ${VOLT_MEAN.toFixed(1)} V`],
        ['WIRE FEED', `CONTINUOUS · ${FEED_MEAN.toFixed(0)} mm/min`],
        ['GAS', `${GAS_MEAN.toFixed(0)} L/min`],
      ],
    },
    {
      title: 'context',
      tone: 'neutral',
      items: [
        ['JOINT', ctx.joint],
        ['MATERIAL', ctx.material],
        ['THICKNESS', `${ctx.thickness_mm} mm`],
        ['WPS', CASE.labels.wps],
      ],
    },
  ];
  return (
    <SceneShell duration={DUR_04} temperature={0.4 + 0.4 * ramp(frame, 0, 200)}>
      {/* receding raw world */}
      <div style={{position: 'absolute', left: 96, top: 200, opacity: ghost, filter: 'blur(5px)'}}>
        <WeldImage src="hero/plate_front.jpg" width={560} height={280} />
      </div>
      <div style={{position: 'absolute', right: 96, top: 200, opacity: ghost, filter: 'blur(4px)'}}>
        <SignalStream values={SIGNALS.current_A} t={SIGNALS.t} progress={1} width={560} height={160} color={colors.chCurrent} axis={false} showValue={false} />
      </div>

      <div style={{position: 'absolute', left: 96, top: 84}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>the neural-symbolic interface</Kicker>
      </div>

      {/* token grid */}
      <div style={{position: 'absolute', left: 96, right: 96, top: 170, display: 'grid', gridTemplateColumns: '1fr 1.25fr 1fr', gap: 40}}>
        {groups.map((g, gi) => (
          <div key={g.title} style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start'}}>
            <Kicker color={g.tone === 'abnormal' ? colors.neural : g.tone === 'nominal' ? colors.symbolic : colors.textMuted} size={14} style={{marginBottom: 6, opacity: fadeIn(frame, 6 + gi * 14)}}>
              {g.title} observations
            </Kicker>
            {g.items.map(([k, v], i) => (
              <ObservationToken key={k} k={k} v={v} tone={i === 0 && g.tone !== 'neutral' ? g.tone : g.tone === 'neutral' ? 'neutral' : 'cool'} size="lg" appear={pop(frame, fps, 10 + gi * 14 + i * 9)} />
            ))}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: 96, right: 96, bottom: 120}}>
        <Title size={46} style={{opacity: fadeIn(frame, 76), transform: `translateY(${(1 - fadeIn(frame, 76)) * 10}px)`}}>
          Neural models perceive the world.
        </Title>
        <Title size={46} color={colors.symbolic} style={{marginTop: 6, opacity: fadeIn(frame, 122), transform: `translateY(${(1 - fadeIn(frame, 122)) * 10}px)`}}>
          Symbolic reasoning operates over what they perceive.
        </Title>
        <Body size={20} style={{marginTop: 18, opacity: fadeIn(frame, 160)}}>
          Structured · inspectable · typed. Not a probability vector handed to another black box.
        </Body>
      </div>
    </SceneShell>
  );
};
