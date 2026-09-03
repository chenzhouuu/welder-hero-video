import React from 'react';
import type {SceneProps} from '../lib/scene';
import {TraceLane, laneScales, type Lane} from '../components/TraceLane';
import {Band, Chip, Stamp, Value} from '../components/marks';
import {signals, PLATEAU, PLATEAU_ROWS} from '../data/hero';
import {CHANNELS} from './01-LiveSensing';
import {rise, seg, easeInOutCubic} from '../lib/ease';
import {tokens} from '../styles/tokens';

const T_ALL: [number, number] = [0, 40];
const PLATEAU_T: [number, number] = [signals.t[PLATEAU_ROWS[0]], signals.t[PLATEAU_ROWS[1]]];

/**
 * Scene 2 — the fast layer reads the log. The whole weld's four channels stand on white; a
 * read head sweeps once; the plateau is banded on the channels that carry a finding and the
 * measured value is written beside it. Channels with nothing to report stay untouched.
 */
export const FastProcess: React.FC<SceneProps> = ({progress: p, width}) => {
  const x = 160;
  const w = width - 160 - 160 - 150;
  const laneH = 170;
  const gap = 58;
  const top = 150;
  const lanes: Lane[] = CHANNELS.map((c, i) => ({x, y: top + i * (laneH + gap), w, h: laneH, tRange: T_ALL, vRange: c.v}));
  const {x: xt} = laneScales(lanes[0]);
  const scan = easeInOutCubic(seg(p, 0.14, 0.42));
  const headX = x + scan * w;
  const headOn = rise(p, 0.12, 0.16) * (1 - rise(p, 0.42, 0.46));
  const bandOn = rise(p, 0.36, 0.44);
  const valueOn = rise(p, 0.5, 0.56);
  const chipOn = rise(p, 0.6, 0.66);
  const bx0 = xt(PLATEAU_T[0]);
  const bx1 = xt(PLATEAU_T[1]);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {lanes.map((lane, i) => (
          <TraceLane key={CHANNELS[i].key} lane={lane} t={signals.t} v={signals[CHANNELS[i].key]} />
        ))}
        {/* read head */}
        <rect x={headX - 70} y={top - 20} width={140} height={4 * (laneH + gap) - gap + 40} fill={tokens.fast} fillOpacity={0.14} opacity={headOn} />
        <line x1={headX} x2={headX} y1={top - 20} y2={top + 4 * (laneH + gap) - gap + 20} stroke={tokens.fast} strokeWidth={2} opacity={headOn} />
        {/* findings: current and voltage plateau */}
        {[0, 1].map((i) => (
          <Band key={i} x0={bx0} x1={bx1} y0={lanes[i].y} y1={lanes[i].y + lanes[i].h} hue={tokens.fast} opacity={bandOn} />
        ))}
      </svg>
      {CHANNELS.map((c, i) => (
        <Value key={c.key} x={x + w + 18} y={lanes[i].y + lanes[i].h - 22} text={c.unit} size={28} hue={tokens.inkSoft} />
      ))}
      <Stamp text="fast layer" hue={tokens.fast} opacity={rise(p, 0.04, 0.1)} />
      <Value x={bx0 + 122} y={lanes[0].y - 40} text={`${PLATEAU.current_A.toFixed(0)} A`} size={32} opacity={valueOn} />
      <Value x={bx0 + 122} y={lanes[1].y - 40} text={`${PLATEAU.voltage_V.toFixed(1)} V`} size={32} opacity={valueOn} />
      <Chip x={bx0} y={lanes[0].y - 44} hue={tokens.fast} text="steady" opacity={chipOn} />
      <Chip x={bx0} y={lanes[1].y - 44} hue={tokens.fast} text="steady" opacity={chipOn} />
    </>
  );
};
