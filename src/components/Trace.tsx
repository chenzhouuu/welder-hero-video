import React, {useMemo} from 'react';

export type TraceProps = {
  t: number[];
  v: number[];
  /** draw samples with t ≤ tEnd (seconds); undefined = all */
  tEnd?: number;
  /** time axis in seconds mapped onto [0, width] */
  tRange: [number, number];
  vRange: [number, number];
  width: number;
  height: number;
  color: string;
  strokeWidth?: number;
  opacity?: number;
  /** draw a dot at the last drawn sample */
  head?: boolean;
  headRadius?: number;
};

/** Map data to SVG coordinates for a trace box. */
export const traceScales = (tRange: [number, number], vRange: [number, number], width: number, height: number) => ({
  x: (tt: number): number => ((tt - tRange[0]) / (tRange[1] - tRange[0])) * width,
  y: (vv: number): number => height - ((vv - vRange[0]) / (vRange[1] - vRange[0])) * height,
});

/**
 * One real sensor channel as a polyline. Nothing else: no frame, no axis, no label.
 * Axes and labels are composed by the scene so that each scene decides what is shown.
 */
export const Trace: React.FC<TraceProps> = ({t, v, tEnd, tRange, vRange, width, height, color, strokeWidth = 3, opacity = 1, head = false, headRadius = 6}) => {
  const {x, y} = traceScales(tRange, vRange, width, height);
  const {d, last} = useMemo(() => {
    const pts: string[] = [];
    let lastIdx = -1;
    for (let i = 0; i < t.length; i++) {
      if (tEnd !== undefined && t[i] > tEnd) break;
      if (t[i] < tRange[0]) continue;
      if (t[i] > tRange[1]) break;
      pts.push(`${x(t[i]).toFixed(1)},${y(v[i]).toFixed(1)}`);
      lastIdx = i;
    }
    return {d: pts.length ? `M${pts.join('L')}` : '', last: lastIdx};
  }, [t, v, tEnd, tRange, vRange, width, height]);
  if (!d) return null;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      {head && last >= 0 ? <circle cx={x(t[last])} cy={y(v[last])} r={headRadius} fill={color} /> : null}
    </g>
  );
};
