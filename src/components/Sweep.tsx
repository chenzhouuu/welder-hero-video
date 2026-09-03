import React from 'react';
import {tokens} from '../styles/tokens';

/**
 * The fast monitor's sliding temporal window on a trace lane: a translucent block that
 * trails the write head, a leading edge, and small ticks left behind where a window was
 * judged. Frame coordinates (SVG).
 */
export const Sweep: React.FC<{x0: number; x1: number; y0: number; y1: number; opacity?: number; ticks?: number[]; hue?: string}> = ({x0, x1, y0, y1, opacity = 1, ticks = [], hue = tokens.fast}) => (
  <g opacity={opacity}>
    <rect x={x0} y={y0} width={Math.max(0, x1 - x0)} height={y1 - y0} fill={hue} fillOpacity={0.14} />
    <line x1={x1} x2={x1} y1={y0} y2={y1} stroke={hue} strokeWidth={2} />
    {ticks.map((tx, i) => (
      <path key={i} d={`M${tx - 6},${y1 + 14}l4,4l8,-9`} fill="none" stroke={hue} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
);
