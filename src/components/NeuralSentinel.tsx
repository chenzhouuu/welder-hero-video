import React from 'react';
import {colors, fonts} from '../styles/tokens';
import {Kicker} from './Text';

type Props = {
  title: string;
  /** animation clock (frames) */
  frame: number;
  /** 0..1 activity level: 0 idle, 1 fully lit */
  activity: number;
  width: number;
  height: number;
  cols?: number;
  rows?: number;
  /** flow direction of the activation wave */
  mode?: 'image' | 'signal';
  opacity?: number;
};

/** Deterministic pseudo-random in [0,1). */
const hash = (x: number, y: number, s: number): number => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + s * 37.719) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * A stylised neural feature block: a grid of activations lit by a travelling wave.
 * It stands for the perception model without pretending to be a real activation map.
 */
export const NeuralSentinel: React.FC<Props> = ({title, frame, activity, width, height, cols = 18, rows = 6, mode = 'image', opacity = 1}) => {
  const cw = width / cols;
  const ch = (height - 44) / rows;
  const wave = (frame * 0.035) % 1.4;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = mode === 'image' ? c / cols : (c / cols + r / rows) / 2;
      const d = Math.abs(pos - wave);
      const w = Math.max(0, 1 - d * 3.2);
      const base = hash(c, r, 1) * 0.35;
      const flick = 0.5 + 0.5 * Math.sin(frame * 0.25 + hash(c, r, 2) * 6.28);
      const a = activity * Math.min(1, base + w * 0.9 * flick + 0.08);
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * cw + 1.5}
          y={44 + r * ch + 1.5}
          width={cw - 3}
          height={ch - 3}
          rx={2}
          fill={colors.neural}
          opacity={0.05 + a * 0.9}
        />,
      );
    }
  }
  return (
    <div style={{position: 'relative', width, height, opacity}}>
      <div style={{position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'baseline', gap: 12}}>
        <Kicker color={colors.neural} size={14}>
          {title}
        </Kicker>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: '0.16em',
            color: colors.bg,
            background: colors.neural,
            padding: '2px 7px',
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          NEURAL
        </span>
      </div>
      <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={0} y={44} width={width} height={height - 44} rx={8} fill="rgba(245,165,36,0.04)" stroke={colors.panelEdge} />
        {cells}
      </svg>
    </div>
  );
};

/** Small arrow with a label, used between pipeline stages. */
export const FlowArrow: React.FC<{length: number; label?: string; vertical?: boolean; color?: string; opacity?: number; progress?: number}> = ({length, label, vertical = false, color = colors.textMuted, opacity = 1, progress = 1}) => {
  const L = Math.max(0, length * progress);
  return (
    <div style={{position: 'relative', width: vertical ? 40 : length, height: vertical ? length : 40, opacity}}>
      <svg width={vertical ? 40 : length} height={vertical ? length : 40} style={{overflow: 'visible'}}>
        {vertical ? (
          <>
            <line x1={20} y1={0} x2={20} y2={L} stroke={color} strokeWidth={1.5} />
            {progress >= 0.98 ? <polygon points={`14,${L - 8} 26,${L - 8} 20,${L}`} fill={color} /> : null}
          </>
        ) : (
          <>
            <line x1={0} y1={20} x2={L} y2={20} stroke={color} strokeWidth={1.5} />
            {progress >= 0.98 ? <polygon points={`${L - 8},14 ${L - 8},26 ${L},20`} fill={color} /> : null}
          </>
        )}
      </svg>
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: vertical ? 28 : 0,
            top: vertical ? length / 2 - 8 : -2,
            width: vertical ? undefined : length,
            textAlign: 'center',
            fontFamily: fonts.mono,
            fontSize: 12,
            letterSpacing: '0.14em',
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
