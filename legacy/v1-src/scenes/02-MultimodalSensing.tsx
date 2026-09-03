import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {SignalStream} from '../components/SignalStream';
import {WeldImage} from '../components/WeldImage';
import {ObservationToken} from '../components/ObservationToken';
import {Body, Kicker, ProvenanceTag, Title} from '../components/Text';
import {CASE, SIGNALS} from '../data/case';
import {colors} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_02 = 252;

/** Scene 2 — the raw modalities, drawn from the real log in compressed time. */
export const MultimodalSensing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = ramp(frame, 12, 180, 0, 1, (t) => t);
  const arc = SIGNALS.arc_on_rows as [number, number];
  const ctx = CASE.raw_data.context;
  const chans: {v: number[]; c: string; l: string; u: string; r: [number, number]}[] = [
    {v: SIGNALS.current_A, c: colors.chCurrent, l: 'current I(t)', u: 'A', r: [0, 340]},
    {v: SIGNALS.voltage_V, c: colors.chVoltage, l: 'voltage V(t)', u: 'V', r: [0, 42]},
    {v: SIGNALS.feed_mm_min, c: colors.chFeed, l: 'wire feed WFS(t)', u: 'mm/min', r: [0, 180]},
    {v: SIGNALS.gas_L_min, c: colors.chGas, l: 'shielding gas', u: 'L/min', r: [0, 32]},
  ];
  return (
    <SceneShell duration={DUR_02} temperature={0.25}>
      <div style={{position: 'absolute', left: 96, top: 96}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>multimodal sensing</Kicker>
        <Title size={44} style={{marginTop: 10, opacity: fadeIn(frame, 10)}}>
          The manufacturing world is multimodal.
        </Title>
      </div>

      {/* image */}
      <div style={{position: 'absolute', left: 96, top: 210, opacity: fadeIn(frame, 16)}}>
        <Kicker color={colors.neural} size={14} style={{marginBottom: 10}}>
          image · post-weld photo
        </Kicker>
        <div style={{transform: `scale(${1 + 0.04 * ramp(frame, 20, 220)})`, transformOrigin: '45% 48%'}}>
          <WeldImage src="hero/plate_front.jpg" width={760} height={380} caption={`${CASE.raw_data.part_no} · label repainted, bead untouched`} />
        </div>
      </div>

      {/* context */}
      <div style={{position: 'absolute', left: 96, top: 660, width: 760}}>
        <Kicker color={colors.neural} size={14} style={{marginBottom: 10, opacity: fadeIn(frame, 60)}}>
          context · manufacturing record
        </Kicker>
        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          {[
            ['JOINT', ctx.joint],
            ['THICKNESS', `${ctx.thickness_mm} mm`],
            ['MATERIAL', ctx.material],
            ['PROCESS', 'CO2 MAG'],
            ['WPS', CASE.labels.wps],
            ['SET CURRENT', `${ctx.nominal_current_A} A`],
          ].map(([k, v], i) => (
            <ObservationToken key={k} k={k} v={v} tone="neutral" size="sm" appear={pop(frame, fps, 64 + i * 7)} />
          ))}
        </div>
      </div>

      {/* signals */}
      <div style={{position: 'absolute', left: 930, top: 210, opacity: fadeIn(frame, 12)}}>
        <Kicker color={colors.neural} size={14} style={{marginBottom: 6}}>
          process signals · 8.6 Hz · six channels logged, four shown
        </Kicker>
        {chans.map((ch) => (
          <div key={ch.l} style={{marginBottom: 2}}>
            <SignalStream values={ch.v} t={SIGNALS.t} progress={p} width={890} height={160} color={ch.c} label={ch.l} unit={ch.u} yRange={ch.r} highlight={arc} />
          </div>
        ))}
        <div style={{display: 'flex', gap: 14, alignItems: 'center', marginTop: 4}}>
          <ProvenanceTag kind="measured" />
          <Kicker size={12} color={colors.textDim}>
            arc on {CASE.raw_data.signals.arc_on_window_s[0]} → {CASE.raw_data.signals.arc_on_window_s[1]} s · shaded
          </Kicker>
        </div>
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 76, display: 'flex', alignItems: 'baseline', gap: 28}}>
        <Title size={40} color={colors.symbolicSoft} style={{opacity: fadeIn(frame, 176)}}>
          From sensing to understanding.
        </Title>
        <Body size={20} style={{opacity: fadeIn(frame, 200)}}>
          Raw data alone is not manufacturing intelligence.
        </Body>
      </div>
    </SceneShell>
  );
};
