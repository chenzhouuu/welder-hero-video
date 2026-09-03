import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {ArchDiagram} from '../components/ArchDiagram';
import {ObservationToken} from '../components/ObservationToken';
import {Body, Kicker, Title} from '../components/Text';
import {DISCLOSURE} from '../data/case';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, fadeOut, pop, ramp} from '../lib/anim';

export const DUR_11 = 300;

/** Scene 11 — welding as one instance of a general architecture; end card. */
export const SmartManufacturingVision: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const partA = Math.min(fadeIn(frame, 0, 10), fadeOut(frame, 212, 16)); // diagram + statements
  const partB = fadeIn(frame, 214, 18); // end card
  const inputs = ['VISION', 'SIGNALS', 'SENSORS', 'MACHINES', 'HUMANS'];
  const reveal = [0, 1, 2, 3].map((i) => fadeIn(frame, 30 + i * 16));
  const statements: [string, string][] = [
    ['NEURAL MODELS PERCEIVE.', colors.neural],
    ['SYMBOLIC KNOWLEDGE STRUCTURES REASONING.', colors.symbolic],
    ['TOGETHER THEY ENABLE MANUFACTURING INTELLIGENCE.', colors.supported],
  ];
  return (
    <SceneShell duration={DUR_11} temperature={0.6} fadeOutFrames={24}>
      {/* part A */}
      <div style={{position: 'absolute', inset: 0, opacity: partA}}>
        <div style={{position: 'absolute', left: 96, top: 84}}>
          <Kicker>the broader vision</Kicker>
          <Title size={40} style={{marginTop: 10}}>
            Welding is one instance of a general architecture.
          </Title>
        </div>
        <div style={{position: 'absolute', left: 96, top: 230, display: 'flex', gap: 12}}>
          {inputs.map((s, i) => (
            <ObservationToken key={s} k="input" v={s} tone="warm" size="sm" appear={pop(frame, fps, 8 + i * 5)} />
          ))}
        </div>
        <div style={{position: 'absolute', left: 96, top: 320, width: 1728}}>
          <ArchDiagram
            width={1728}
            height={130}
            stages={[
              {label: 'NEURAL PERCEPTION', tone: 'neural', sub: 'raw data → structured observations'},
              {label: 'STRUCTURED OBSERVATIONS', tone: 'bridge', sub: 'typed · inspectable · routed'},
              {label: 'SYMBOLIC REASONING', tone: 'symbolic', sub: 'knowledge · rules · mechanisms · history'},
              {label: 'MANUFACTURING INTELLIGENCE', tone: 'output', sub: 'diagnosis · action · learning'},
            ]}
            reveal={reveal}
          />
        </div>
        <div style={{position: 'absolute', left: 96, top: 480, display: 'flex', gap: 18, alignItems: 'baseline', opacity: fadeIn(frame, 100)}}>
          <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, letterSpacing: '0.08em', color: colors.text}}>WELDER</span>
          <Body size={20}>a concrete case study in intelligent welding inspection and diagnosis</Body>
        </div>
        <div style={{position: 'absolute', left: 96, top: 600, display: 'flex', flexDirection: 'column', gap: 18}}>
          {statements.map(([s, c], i) => (
            <div key={s} style={{fontFamily: fonts.sans, fontSize: 44, fontWeight: 700, letterSpacing: '-0.01em', color: c, opacity: fadeIn(frame, 124 + i * 24), transform: `translateY(${(1 - fadeIn(frame, 124 + i * 24)) * 10}px)`}}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* part B — end card */}
      <div style={{position: 'absolute', inset: 0, opacity: partB, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <Kicker size={16} color={colors.symbolic} style={{opacity: fadeIn(frame, 220)}}>
          neural-symbolic ai for the next generation of smart manufacturing
        </Kicker>
        <div style={{fontFamily: fonts.sans, fontSize: 120, fontWeight: 800, letterSpacing: '0.06em', color: colors.text, marginTop: 20, opacity: fadeIn(frame, 226), transform: `scale(${0.96 + 0.04 * ramp(frame, 226, 260)})`}}>WELDER</div>
        <Body size={26} color={colors.textMuted} style={{marginTop: 6, opacity: fadeIn(frame, 236)}}>
          Weld Expertise by Learned Distillation of Explanatory Reasoning
        </Body>
        <Title size={38} weight={500} style={{marginTop: 46, opacity: fadeIn(frame, 248)}}>
          <span style={{color: colors.neural}}>Perceive</span> with neural models. <span style={{color: colors.symbolic}}>Reason</span> with manufacturing knowledge.
        </Title>
        <Body size={15} color={colors.textDim} style={{marginTop: 70, maxWidth: 1100, opacity: fadeIn(frame, 262)}}>
          {DISCLOSURE}
        </Body>
      </div>
    </SceneShell>
  );
};
