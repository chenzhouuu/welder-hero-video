import React from 'react';
import {Trace, traceScales} from './Trace';
import {tokens} from '../styles/tokens';

export type Lane = {x: number; y: number; w: number; h: number; tRange: [number, number]; vRange: [number, number]};

type Props = {
  lane: Lane;
  t: number[];
  v: number[];
  tEnd?: number;
  ink?: string;
  strokeWidth?: number;
  baseline?: boolean;
  head?: boolean;
  opacity?: number;
  children?: React.ReactNode;
};

/** Screen-space scales for a lane (x in frame pixels for a time, y for a value). */
export const laneScales = (lane: Lane) => {
  const s = traceScales(lane.tRange, lane.vRange, lane.w, lane.h);
  return {x: (tt: number): number => lane.x + s.x(tt), y: (vv: number): number => lane.y + s.y(vv)};
};

/**
 * One channel in ink, positioned in frame coordinates. Children are SVG marks drawn in the
 * same frame coordinates (bands, links), placed above the trace.
 */
export const TraceLane: React.FC<Props> = ({lane, t, v, tEnd, ink = tokens.ink, strokeWidth = 3, baseline = true, head = false, opacity = 1, children}) => (
  <g opacity={opacity}>
    {baseline ? <line x1={lane.x} x2={lane.x + lane.w} y1={lane.y + lane.h} y2={lane.y + lane.h} stroke={ink} strokeOpacity={0.18} strokeWidth={1} /> : null}
    <g transform={`translate(${lane.x},${lane.y})`}>
      <Trace t={t} v={v} tEnd={tEnd} tRange={lane.tRange} vRange={lane.vRange} width={lane.w} height={lane.h} color={ink} strokeWidth={strokeWidth} head={head} headRadius={5} />
    </g>
    {children}
  </g>
);
