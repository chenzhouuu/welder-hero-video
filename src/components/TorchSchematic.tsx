import React from 'react';
import {tokens} from '../styles/tokens';

/**
 * Qualitative engineering schematic of a T-fillet joint in cross-section with the torch,
 * for the training beat. `variant` 'observed' aims the torch at the bottom plate with an
 * uneven travel; 'recommended' is the symmetric work angle with a steady travel.
 * ILLUSTRATIVE: no torch-angle or travel sensor exists; nothing here is measured, so no
 * angle values are written. Drawn in a 900×640 local box; place with a transform.
 */
export const TorchSchematic: React.FC<{variant: 'observed' | 'recommended'; opacity?: number; draw?: number}> = ({variant, opacity = 1, draw = 1}) => {
  const rec = variant === 'recommended';
  const cx = 470;
  const cy = 470;
  const th = 34;
  const angleDeg = rec ? 45 : 26;
  const a = (angleDeg * Math.PI) / 180;
  const len = 300;
  const tipX = cx + 24;
  const tipY = cy - 24;
  const ex = tipX + Math.cos(a) * len;
  const ey = tipY - Math.sin(a) * len;
  const hue = rec ? tokens.slow : tokens.fast;
  const dashes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <svg width={900} height={640} viewBox="0 0 900 640" style={{position: 'absolute', left: 0, top: 0, opacity, overflow: 'visible'}}>
      <rect x={cx - th} y={120} width={th} height={cy - 120} fill="#DAD9D3" stroke={tokens.ink} strokeWidth={2} />
      <rect x={cx - th} y={cy} width={420} height={th} fill="#DAD9D3" stroke={tokens.ink} strokeWidth={2} />
      <path d={`M${cx},${cy - 110} Q${cx + 40},${cy - 40} ${cx + 110},${cy}`} fill="#B9B8B1" stroke={tokens.ink} strokeWidth={2} />
      {/* the bisector the torch should follow, faint */}
      <line x1={cx} y1={cy} x2={cx + 300 * Math.cos(Math.PI / 4)} y2={cy - 300 * Math.sin(Math.PI / 4)} stroke={tokens.ink} strokeWidth={1} strokeDasharray="3 8" opacity={0.35} />
      {/* torch */}
      <g opacity={draw}>
        <line x1={tipX} y1={tipY} x2={ex} y2={ey} stroke={hue} strokeWidth={30} opacity={0.9} />
        <line x1={tipX + Math.cos(a) * 40} y1={tipY - Math.sin(a) * 40} x2={ex} y2={ey} stroke={hue} strokeWidth={46} opacity={0.3} />
        <line x1={tipX - Math.cos(a) * 26} y1={tipY + Math.sin(a) * 26} x2={tipX} y2={tipY} stroke={tokens.ink} strokeWidth={4} />
        {/* arc focus: where the heat goes */}
        <ellipse cx={rec ? cx + 46 : cx + 78} cy={rec ? cy - 46 : cy - 12} rx={rec ? 34 : 44} ry={rec ? 34 : 18} fill={hue} fillOpacity={0.22} />
      </g>
      {/* travel along the weld: the regularity of the dashes is the practice */}
      <g transform={`translate(${cx - th - 40},${cy + th + 70})`} opacity={draw}>
        <text x={0} y={-16} fontSize={22} fill={tokens.inkSoft} fontFamily={tokens.font}>travel</text>
        {dashes.map((i) => {
          const jitter = rec ? 0 : ((i * 7) % 3) * (i % 2 === 0 ? 9 : -6);
          const w = rec ? 30 : 22 + ((i * 13) % 17);
          return <rect key={i} x={i * 52 + jitter * 0.6} y={0} width={w} height={8} fill={hue} opacity={0.85} />;
        })}
        <path d={`M${9 * 52 + 10},4 l-14,-10 v20 z`} fill={hue} />
      </g>
    </svg>
  );
};
