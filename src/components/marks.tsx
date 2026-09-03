import React from 'react';
import {tokens} from '../styles/tokens';

/**
 * The whole vocabulary of marks a model may leave on the data. Everything here is drawn in
 * SVG (image or trace coordinates) or as a small HTML label; nothing is a card.
 */

/** One-word label on a solid chip of the finding's hue (Grounded SAM 2 rule). HTML. */
export const Chip: React.FC<{x: number; y: number; hue: string; text: string; size?: number; opacity?: number; anchor?: 'left' | 'right'}> = ({x, y, hue, text, size = 26, opacity = 1, anchor = 'left'}) => (
  <div
    style={{
      position: 'absolute',
      left: anchor === 'left' ? x : undefined,
      right: anchor === 'right' ? x : undefined,
      top: y,
      background: hue,
      color: '#fff',
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1,
      padding: `${Math.round(size * 0.32)}px ${Math.round(size * 0.5)}px`,
      letterSpacing: -0.2,
      whiteSpace: 'nowrap',
      opacity,
    }}
  >
    {text}
  </div>
);

/** Layer stamp, top-left, ink or hue on a translucent ground (Cutie rule). HTML. */
export const Stamp: React.FC<{text: string; hue?: string; opacity?: number; onDark?: boolean}> = ({text, hue, opacity = 1, onDark = false}) => (
  <div
    style={{
      position: 'absolute',
      left: 48,
      top: 40,
      fontSize: 28,
      fontWeight: 500,
      lineHeight: 1,
      padding: '10px 14px',
      color: hue ?? (onDark ? '#fff' : tokens.ink),
      background: onDark ? 'rgba(0,0,0,0.45)' : 'rgba(250,250,248,0.85)',
      opacity,
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </div>
);

/** Measured value written in ink beside a mark (VisProg substitution). HTML. */
export const Value: React.FC<{x: number; y: number; text: string; hue?: string; size?: number; opacity?: number; align?: 'left' | 'right' | 'center'}> = ({x, y, text, hue, size = 30, opacity = 1, align = 'left'}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: align === 'right' ? 'translateX(-100%)' : align === 'center' ? 'translateX(-50%)' : undefined,
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1,
      color: hue ?? tokens.ink,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      opacity,
    }}
  >
    {text}
  </div>
);

/** Caption strip sentence, bottom of the frame (Nerfies / YAY rule). HTML. */
export const Caption: React.FC<{text: string; hue?: string; opacity?: number; y?: number}> = ({text, hue, opacity = 1, y = 1080 - 120}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity}}>
    <div style={{fontSize: 44, fontWeight: 500, lineHeight: 1.15, color: hue ? '#fff' : tokens.ink, background: hue ?? 'transparent', padding: hue ? '14px 26px' : 0, letterSpacing: -0.4}}>{text}</div>
  </div>
);

/** SAM-style translucent click disc. SVG, in the coordinates of its parent. */
export const Marker: React.FC<{cx: number; cy: number; r: number; opacity: number}> = ({cx, cy, r, opacity}) => (
  <g opacity={opacity}>
    <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.55)" stroke="#fff" strokeWidth={r * 0.12} />
    <circle cx={cx} cy={cy} r={r * 0.22} fill="#fff" />
  </g>
);

/** A filled region with a 2 px outline in the finding's hue. SVG. */
export const Region: React.FC<{d: string; hue: string; fill?: number; opacity?: number; strokeWidth?: number}> = ({d, hue, fill = 0.55, opacity = 1, strokeWidth = 2}) => (
  <g opacity={opacity}>
    <path d={d} fill={hue} fillOpacity={fill} stroke={hue} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </g>
);

/** Translucent band over an interval of a trace lane. SVG. */
export const Band: React.FC<{x0: number; x1: number; y0: number; y1: number; hue: string; opacity?: number; alpha?: number}> = ({x0, x1, y0, y1, hue, opacity = 1, alpha = 0.18}) => (
  <rect x={x0} y={y0} width={Math.max(0, x1 - x0)} height={Math.max(0, y1 - y0)} fill={hue} fillOpacity={alpha} opacity={opacity} />
);

export type LinkState = 'pending' | 'supported' | 'unverified' | 'refuted';

/**
 * ReKep-style line from a cause to its evidence. `d` is the already-cut partial path
 * (see lib/geom partialQuad), so any state can be drawn in. SVG.
 */
export const Link: React.FC<{d: string; hue: string; state: LinkState; opacity?: number; width?: number}> = ({d, hue, state, opacity = 1, width = 3}) => {
  if (!d) return null;
  const dash = state === 'unverified' ? '3 16' : state === 'refuted' ? '18 14' : undefined;
  return (
    <path
      d={d}
      fill="none"
      stroke={state === 'refuted' ? tokens.inkSoft : hue}
      strokeWidth={state === 'supported' ? width * 1.8 : width}
      strokeLinecap="round"
      strokeDasharray={dash}
      opacity={opacity}
    />
  );
};
