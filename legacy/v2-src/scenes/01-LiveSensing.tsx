import React from 'react';
import type {SceneProps} from '../lib/scene';
import {ArcClip} from '../components/ArcClip';
import {TraceLane, type Lane} from '../components/TraceLane';
import {Value} from '../components/marks';
import {signals} from '../data/hero';
import {rise} from '../lib/ease';

/** Log seconds shown by the scene: just before ignition to just after extinction. */
export const S1_T: [number, number] = [3.5, 32.0];

export const CHANNELS = [
  {key: 'current_A', unit: 'A', v: [0, 340] as [number, number]},
  {key: 'voltage_V', unit: 'V', v: [0, 45] as [number, number]},
  {key: 'feed_mm_min', unit: 'mm/min', v: [0, 180] as [number, number]},
  {key: 'gas_L_min', unit: 'L/min', v: [0, 32] as [number, number]},
] as const;

/**
 * Scene 1 — the weld itself. Real arc footage fills the frame; the four process channels
 * write themselves underneath in sync with the footage. No model yet: light ink only.
 */
export const LiveSensing: React.FC<SceneProps & {clipStartProgress?: number}> = ({progress, width, height, dur, clipStartProgress = 0}) => {
  const [t0, t1] = S1_T;
  const tLog = t0 + (t1 - t0) * progress;
  const speed = (t1 - t0) / dur;
  const laneH = 62;
  const gap = 24;
  const x = 96;
  const w = width - 96 - 96 - 150;
  const top = height - 4 * (laneH + gap) - 30;
  const ink = 'rgba(255,255,255,0.92)';
  const lanesIn = rise(progress, 0.0, 0.08);
  return (
    <>
      <ArcClip tLogStart={t0 + (t1 - t0) * clipStartProgress} speed={speed} width={width} height={height} />
      <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0}}>
        {CHANNELS.map((c, i) => {
          const lane: Lane = {x, y: top + i * (laneH + gap), w, h: laneH, tRange: S1_T, vRange: c.v};
          return <TraceLane key={c.key} lane={lane} t={signals.t} v={signals[c.key]} tEnd={tLog} ink={ink} strokeWidth={2.5} head opacity={lanesIn} />;
        })}
      </svg>
      {CHANNELS.map((c, i) => (
        <Value key={c.key} x={x + w + 18} y={top + i * (laneH + gap) + laneH - 24} text={c.unit} hue="rgba(255,255,255,0.8)" size={26} opacity={lanesIn} />
      ))}
      <Value x={width - 96} y={64} text={`${tLog.toFixed(1)} s`} hue="rgba(255,255,255,0.85)" size={30} align="right" />
    </>
  );
};
