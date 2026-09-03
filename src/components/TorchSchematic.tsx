import React from 'react';
import {tokens} from '../styles/tokens';

/**
 * Engineering schematic of a T-fillet joint in cross-section with the torch, used for the
 * training beat. `k` = 0 shows the observed practice (torch aimed at the bottom plate, uneven
 * travel), `k` = 1 the recommended practice (45° work angle, steady travel). ILLUSTRATIVE:
 * no torch-angle or travel sensor exists in the dataset; the geometry is textbook, not measured.
 * Drawn in a 900×640 local box; place with a transform.
 */
export const TorchSchematic: React.FC<{k: number; opacity?: number}> = ({k, opacity = 1}) => {
  // joint: vertical plate on the left of the corner, horizontal plate at the bottom
  const cx = 470; // corner (weld root) x
  const cy = 470; // corner y
  const th = 34; // plate thickness
  const angleDeg = 28 + (45 - 28) * k; // work angle from the bottom plate
  const a = (angleDeg * Math.PI) / 180;
  const len = 300;
  const tipX = cx + 24;
  const tipY = cy - 24;
  const ex = tipX + Math.cos(a) * len;
  const ey = tipY - Math.sin(a) * len;
  const hue = k < 0.5 ? tokens.fast : tokens.slow;
  const mixHue = `color-mix(in srgb, ${tokens.fast} ${Math.round((1 - k) * 100)}%, ${tokens.slow})`;
  const dashes: number[] = [];
  for (let i = 0; i < 9; i++) dashes.push(i);
  return (
    <svg width={900} height={640} viewBox="0 0 900 640" style={{position: 'absolute', left: 0, top: 0, opacity, overflow: 'visible'}}>
      {/* plates */}
      <rect x={cx - th} y={120} width={th} height={cy - 120} fill="#DAD9D3" stroke={tokens.ink} strokeWidth={2} />
      <rect x={cx - th} y={cy} width={420} height={th} fill="#DAD9D3" stroke={tokens.ink} strokeWidth={2} />
      {/* fillet weld (right-hand side of the vertical plate) */}
      <path d={`M${cx},${cy - 110} Q${cx + 40},${cy - 40} ${cx + 110},${cy}`} fill="#B9B8B1" stroke={tokens.ink} strokeWidth={2} />
      <line x1={cx} y1={cy - 110} x2={cx} y2={cy} stroke={tokens.ink} strokeWidth={2} strokeOpacity={0.35} />
      <line x1={cx} y1={cy} x2={cx + 110} y2={cy} stroke={tokens.ink} strokeWidth={2} strokeOpacity={0.35} />
      {/* torch: wire, contact tip, nozzle */}
      <line x1={tipX} y1={tipY} x2={ex} y2={ey} stroke={mixHue} strokeWidth={30} strokeLinecap="butt" opacity={0.9} />
      <line x1={tipX + Math.cos(a) * 40} y1={tipY - Math.sin(a) * 40} x2={ex} y2={ey} stroke={mixHue} strokeWidth={46} strokeLinecap="butt" opacity={0.35} />
      <line x1={tipX - Math.cos(a) * 26} y1={tipY + Math.sin(a) * 26} x2={tipX} y2={tipY} stroke={tokens.ink} strokeWidth={4} />
      {/* work-angle arc and value */}
      <path d={`M${cx + 130},${cy} A130,130 0 0 0 ${cx + 130 * Math.cos(a)},${cy - 130 * Math.sin(a)}`} fill="none" stroke={mixHue} strokeWidth={2} strokeDasharray="4 6" />
      <text x={cx + 150} y={cy - 28} fontSize={30} fontWeight={500} fill={mixHue} fontFamily='"Inter Variable", Inter, system-ui, sans-serif' style={{fontVariantNumeric: 'tabular-nums'}}>
        {`${Math.round(angleDeg)}°`}
      </text>
      {/* travel along the weld (out of the page): a dashed arrow whose regularity is the practice */}
      <g transform={`translate(${cx - th - 40},${cy + th + 70})`}>
        <text x={0} y={-16} fontSize={22} fill={tokens.inkSoft} fontFamily='"Inter Variable", Inter, system-ui, sans-serif'>travel</text>
        {dashes.map((i) => {
          const jitter = (1 - k) * (i % 2 === 0 ? 14 : -10) * ((i * 7) % 3);
          const w = 30 + (1 - k) * ((i * 13) % 17);
          return <rect key={i} x={i * 52 + jitter * 0.4} y={0} width={w} height={8} fill={hue} opacity={0.85} />;
        })}
        <path d={`M${9 * 52 + 10},4 l-14,-10 v20 z`} fill={hue} />
      </g>
    </svg>
  );
};
