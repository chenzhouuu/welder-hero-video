import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {SignalStream} from '../components/SignalStream';
import {WeldImage} from '../components/WeldImage';
import {NeuralSentinel, FlowArrow} from '../components/NeuralSentinel';
import {ObservationToken} from '../components/ObservationToken';
import {Kicker, ProvenanceTag, Title} from '../components/Text';
import {CASE, SIGNALS, PLATEAU_A, PLATEAU_CV, VOLT_MEAN, VOLT_CV, FEED_MEAN, GAS_MEAN} from '../data/case';
import {colors} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_03 = 402;

/** Scene 3 — two neural sentinels turn continuous data into structured observations. */
export const NeuralPerception: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const recede = ramp(frame, 336, 392); // raw data and nets dim; tokens stay
  const rawOpacity = 1 - 0.85 * recede;
  const blur = 6 * recede;
  const scan = ramp(frame, 24, 112, -0.02, 1.02, (t) => t);
  const heat = ramp(frame, 96, 150);
  const activity = ramp(frame, 22, 64);
  const win = ramp(frame, 24, 130, 0, 1, (t) => t);
  const arc = SIGNALS.arc_on_rows as [number, number];
  const winIdx: [number, number] = [Math.round(arc[0] + (arc[1] - arc[0] - 40) * win), Math.round(arc[0] + (arc[1] - arc[0] - 40) * win) + 40];
  const vis = CASE.neural_observations.visual;

  const visualTokens: [string, string][] = [
    ['DEFECT', vis.defect],
    ['LOCATION', 'WELD TOE · lower'],
    ['MORPHOLOGY', 'CONTINUOUS TOE GROOVE'],
  ];
  const processTokens: [string, string][] = [
    ['ARC STABILITY', 'NOMINAL'],
    ['CURRENT', `STEADY · ${PLATEAU_A.toFixed(0)} A · CV ${PLATEAU_CV.toFixed(3)}`],
    ['VOLTAGE', `STEADY · ${VOLT_MEAN.toFixed(1)} V · CV ${VOLT_CV.toFixed(3)}`],
    ['WIRE FEED', `CONTINUOUS · ${FEED_MEAN.toFixed(0)} mm/min`],
    ['GAS', `FLOWING · ${GAS_MEAN.toFixed(0)} L/min`],
  ];

  return (
    <SceneShell duration={DUR_03} temperature={0.2 + 0.4 * recede}>
      <div style={{position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>fast neural perception</Kicker>
        <Title size={40} style={{opacity: fadeIn(frame, 8)}}>
          What do we observe?
        </Title>
      </div>

      {/* ---------- Visual sentinel (left) ---------- */}
      <div style={{position: 'absolute', left: 96, top: 170, width: 820}}>
        <div style={{opacity: rawOpacity, filter: blur ? `blur(${blur}px)` : undefined}}>
          <Kicker color={colors.neural} size={13} style={{marginBottom: 8}}>
            input · bead crop (label removed)
          </Kicker>
          <WeldImage src="hero/bead_strip.jpg" width={820} height={108} scan={scan} heat={heat} box={[0.36, 0.55, 0.6, 0.42]} boxLabel="attention · lower toe" objectFit="cover" />
          <div style={{marginTop: 22}}>
            <NeuralSentinel title="visual sentinel" frame={frame} activity={activity} width={820} height={150} mode="image" />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 6, opacity: rawOpacity}}>
          <FlowArrow length={36} vertical label="observations" progress={ramp(frame, 120, 140)} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8, alignItems: 'flex-start'}}>
          {visualTokens.map(([k, v], i) => (
            <ObservationToken key={k} k={k} v={v} tone={i === 0 ? 'abnormal' : 'cool'} size="lg" appear={pop(frame, fps, 142 + i * 22)} />
          ))}
          <div style={{display: 'flex', gap: 10, opacity: fadeIn(frame, 215)}}>
            <ProvenanceTag kind="model output" />
            <Kicker size={11} color={colors.textDim}>
              location · morphology from the WELDER-CoE teacher record · verified
            </Kicker>
          </div>
        </div>
      </div>

      {/* ---------- Process sentinel (right) ---------- */}
      <div style={{position: 'absolute', left: 1000, top: 170, width: 824}}>
        <div style={{opacity: rawOpacity, filter: blur ? `blur(${blur}px)` : undefined}}>
          <Kicker color={colors.neural} size={13} style={{marginBottom: 4}}>
            input · process signals (sliding window)
          </Kicker>
          <SignalStream values={SIGNALS.current_A} t={SIGNALS.t} progress={1} width={824} height={118} color={colors.chCurrent} label="current" unit="A" yRange={[0, 340]} highlight={winIdx} showValue={false} />
          <SignalStream values={SIGNALS.voltage_V} t={SIGNALS.t} progress={1} width={824} height={96} color={colors.chVoltage} label="voltage" unit="V" yRange={[0, 42]} highlight={winIdx} showValue={false} />
          <div style={{marginTop: 10}}>
            <NeuralSentinel title="process sentinel" frame={frame + 40} activity={activity} width={824} height={120} rows={4} cols={24} mode="signal" />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 4, opacity: rawOpacity}}>
          <FlowArrow length={30} vertical label="observations" progress={ramp(frame, 130, 150)} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6, alignItems: 'flex-start'}}>
          {processTokens.map(([k, v], i) => (
            <ObservationToken key={k} k={k} v={v} tone={i === 0 ? 'nominal' : 'cool'} size="md" appear={pop(frame, fps, 152 + i * 18)} />
          ))}
          <div style={{display: 'flex', gap: 10, opacity: fadeIn(frame, 250)}}>
            <ProvenanceTag kind="measured" />
            <Kicker size={11} color={colors.textDim}>
              arc-on plateau statistics · stability vs. good-weld reference (CV ≤ 0.116)
            </Kicker>
          </div>
        </div>
      </div>

      {/* bottom message */}
      <div style={{position: 'absolute', left: 96, bottom: 70, display: 'flex', alignItems: 'baseline', gap: 22, opacity: fadeIn(frame, 262)}}>
        <Kicker size={24} color={colors.neural}>
          raw continuous data
        </Kicker>
        <span style={{color: colors.textDim, fontSize: 30}}>→</span>
        <Kicker size={24} color={colors.symbolic}>
          structured observations
        </Kicker>
        <Kicker size={15} color={colors.textDim} style={{marginLeft: 20}}>
          pixels and signals become symbols
        </Kicker>
      </div>
    </SceneShell>
  );
};
