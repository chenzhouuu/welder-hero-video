import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {WeldCell} from '../components/WeldCell';
import {SignalStream} from '../components/SignalStream';
import {ObservationToken} from '../components/ObservationToken';
import {Body, Kicker, Title} from '../components/Text';
import {CASE, SIGNALS} from '../data/case';
import {colors} from '../styles/tokens';
import {fadeIn, pop, ramp, hold} from '../lib/anim';

export const DUR_01 = 252;

/** Scene 1 — the physical event and the evidence it leaves. */
export const ManufacturingWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const travel = ramp(frame, 18, 150);
  const arc = frame < 150 ? Math.min(1, fadeIn(frame, 18, 10)) : ramp(frame, 150, 168, 1, 0);
  const digital = ramp(frame, 168, 222);
  const sparkP = ramp(frame, 18, 168, 0, 1, (t) => t);
  const labels = [CASE.labels.operator, CASE.labels.station, CASE.labels.part, CASE.labels.weld];
  const labelKeys = ['OPERATOR', 'STATION', 'PART', 'WELD'];
  const streams = ['IMAGE', 'I(t)', 'V(t)', 'WFS(t)', 'CONTEXT'];

  return (
    <SceneShell duration={DUR_01} temperature={0.15 + 0.5 * digital}>
      {/* headline */}
      <div style={{position: 'absolute', left: 96, top: 120, width: 1150}}>
        <Kicker style={{opacity: fadeIn(frame, 6)}}>manufacturing world</Kicker>
        <Title size={56} style={{marginTop: 14, opacity: fadeIn(frame, 60), transform: `translateY(${(1 - fadeIn(frame, 60)) * 12}px)`}}>
          Every weld generates more than a product.
        </Title>
        <Title size={56} color={colors.neural} style={{marginTop: 6, opacity: fadeIn(frame, 104), transform: `translateY(${(1 - fadeIn(frame, 104)) * 12}px)`}}>
          It generates evidence.
        </Title>
      </div>

      {/* traceability labels */}
      <div style={{position: 'absolute', right: 96, top: 128, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end'}}>
        {labels.map((l, i) => (
          <ObservationToken key={l} k={labelKeys[i]} v={l} tone="neutral" size="sm" appear={pop(frame, fps, 24 + i * 8)} />
        ))}
      </div>

      {/* welding cell */}
      <div style={{position: 'absolute', left: 150, top: 330}}>
        <WeldCell width={980} height={560} travel={travel} digital={digital} arc={arc} />
      </div>

      {/* live current sparkline drawn from the real log */}
      <div style={{position: 'absolute', left: 1130, top: 620, opacity: fadeIn(frame, 18)}}>
        <SignalStream values={SIGNALS.current_A} t={SIGNALS.t} progress={sparkP} width={640} height={200} color={colors.chCurrent} label="primary weld current" unit="A" yRange={[0, 340]} glow />
        <Kicker style={{marginTop: 6}} color={colors.textDim}>
          measured · {CASE.raw_data.part_no}
        </Kicker>
      </div>

      {/* evidence streams peel off the arc */}
      <div style={{position: 'absolute', left: 1130, top: 380, display: 'flex', gap: 12, flexWrap: 'wrap', width: 700}}>
        {streams.map((s, i) => (
          <ObservationToken key={s} k="evidence" v={s} tone="warm" size="sm" appear={pop(frame, fps, 118 + i * 9)} />
        ))}
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 84, opacity: hold(frame, 176, DUR_01 + 30)}}>
        <Body size={22} color={colors.symbolicSoft}>
          The physical process becomes a digital record: image, current, voltage, wire feed, context.
        </Body>
      </div>
    </SceneShell>
  );
};
