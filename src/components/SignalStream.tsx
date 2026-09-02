import React, {useMemo} from 'react';
import {colors, fonts} from '../styles/tokens';

type Props = {
  values: number[];
  t: number[];
  /** fraction of samples drawn, 0..1 */
  progress: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  unit?: string;
  yRange?: [number, number];
  /** sample index window to highlight (e.g. arc-on plateau) */
  highlight?: [number, number];
  /** horizontal band drawn as a reference window, in data units */
  band?: [number, number];
  bandLabel?: string;
  glow?: boolean;
  showValue?: boolean;
  axis?: boolean;
  strokeWidth?: number;
  /** dim the trace (neural world receding) */
  opacity?: number;
};

/** Progressive SVG trace of a real sensor channel. Deterministic in `progress`. */
export const SignalStream: React.FC<Props> = ({
  values,
  t,
  progress,
  width,
  height,
  color,
  label,
  unit,
  yRange,
  highlight,
  band,
  bandLabel,
  glow = true,
  showValue = true,
  axis = true,
  strokeWidth = 2.2,
  opacity = 1,
}) => {
  const padL = axis ? 54 : 6;
  const padR = 12;
  const padT = label ? 30 : 8;
  const padB = axis ? 22 : 6;
  const n = values.length;
  const [ymin, ymax] = useMemo(() => {
    if (yRange) return yRange;
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const pad = (hi - lo) * 0.08 || 1;
    return [lo - pad, hi + pad];
  }, [values, yRange]);
  const tmax = t[n - 1];
  const x = (i: number): number => padL + (t[i] / tmax) * (width - padL - padR);
  const y = (v: number): number => padT + (1 - (v - ymin) / (ymax - ymin)) * (height - padT - padB);
  const shown = Math.max(2, Math.min(n, Math.floor(progress * n)));
  const pts = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < shown; i++) out.push(`${x(i).toFixed(1)},${y(values[i]).toFixed(1)}`);
    return out.join(' ');
  }, [shown, values, ymin, ymax, width, height]);
  const last = shown - 1;
  const id = `g-${color.replace('#', '')}-${width}`;

  return (
    <svg width={width} height={height} style={{overflow: 'visible', opacity}}>
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* frame */}
      <rect x={padL} y={padT} width={width - padL - padR} height={height - padT - padB} fill="rgba(255,255,255,0.015)" stroke={colors.panelEdge} strokeWidth={1} />
      {band ? (
        <g>
          <rect x={padL} y={y(band[1])} width={width - padL - padR} height={Math.max(1, y(band[0]) - y(band[1]))} fill={colors.symbolic} opacity={0.10} />
          <line x1={padL} x2={width - padR} y1={y(band[1])} y2={y(band[1])} stroke={colors.symbolic} strokeDasharray="4 4" opacity={0.6} />
          <line x1={padL} x2={width - padR} y1={y(band[0])} y2={y(band[0])} stroke={colors.symbolic} strokeDasharray="4 4" opacity={0.6} />
          {bandLabel ? (
            <text x={width - padR - 6} y={y(band[1]) - 6} fill={colors.symbolicSoft} fontFamily={fonts.mono} fontSize={12} textAnchor="end">
              {bandLabel}
            </text>
          ) : null}
        </g>
      ) : null}
      {highlight ? (
        <rect x={x(highlight[0])} y={padT} width={x(Math.min(highlight[1], n - 1)) - x(highlight[0])} height={height - padT - padB} fill={color} opacity={0.07} />
      ) : null}
      {axis ? (
        <g fontFamily={fonts.mono} fontSize={13} fill={colors.textDim}>
          <text x={padL - 8} y={y(ymax) + 10} textAnchor="end">
            {ymax.toFixed(0)}
          </text>
          <text x={padL - 8} y={y(ymin)} textAnchor="end">
            {ymin.toFixed(0)}
          </text>
          <text x={padL} y={height - 6} textAnchor="start">
            0 s
          </text>
          <text x={width - padR} y={height - 6} textAnchor="end">
            {tmax.toFixed(0)} s
          </text>
        </g>
      ) : null}
      {label ? (
        <text x={padL} y={18} fill={colors.textMuted} fontFamily={fonts.mono} fontSize={14} letterSpacing="0.14em">
          {label.toUpperCase()}
          {unit ? <tspan fill={colors.textDim}>{`  [${unit}]`}</tspan> : null}
        </text>
      ) : null}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" filter={glow ? `url(#${id})` : undefined} />
      {progress < 1 ? <circle cx={x(last)} cy={y(values[last])} r={4} fill={color} filter={`url(#${id})`} /> : null}
      {showValue ? (
        <text x={Math.min(x(last) + 8, width - 70)} y={y(values[last]) - 8} fill={color} fontFamily={fonts.mono} fontSize={14} fontWeight={600}>
          {values[last].toFixed(1)}
          {unit ? ` ${unit}` : ''}
        </text>
      ) : null}
    </svg>
  );
};
