import React from 'react';
import {colors, fonts} from '../styles/tokens';

type Props = {
  width: number;
  height: number;
  /** 0..1 torch travel along the joint */
  travel: number;
  /** 0 = solid render, 1 = wireframe/digital */
  digital: number;
  /** arc intensity 0..1 */
  arc: number;
  opacity?: number;
};

/**
 * Stylised robotic fillet-weld cell (isometric SVG): two plates, torch, arc, growing bead.
 * Illustrative only; it carries no data.
 */
export const WeldCell: React.FC<Props> = ({width, height, travel, digital, arc, opacity = 1}) => {
  const W = width;
  const H = height;
  // isometric plate geometry (relative to a 900x520 design box)
  const sx = W / 900;
  const sy = H / 520;
  const P = (x: number, y: number): string => `${(x * sx).toFixed(1)},${(y * sy).toFixed(1)}`;
  // horizontal plate (parallelogram) and vertical plate (rectangle standing on its back edge)
  const hPlate = [P(150, 380), P(700, 380), P(820, 300), P(270, 300)].join(' ');
  const hPlateSide = [P(150, 380), P(700, 380), P(700, 398), P(150, 398)].join(' ');
  const vPlate = [P(270, 300), P(820, 300), P(820, 150), P(270, 150)].join(' ');
  const vPlateTop = [P(270, 150), P(820, 150), P(835, 140), P(285, 140)].join(' ');
  // joint line from (300,300) to (790,300); bead grows along it
  const jx0 = 300;
  const jx1 = 790;
  const jy = 300;
  const tx = jx0 + (jx1 - jx0) * Math.max(0, Math.min(1, travel));
  const beadW = Math.max(0, tx - jx0);
  const metal = `rgba(${Math.round(150 - 60 * digital)},${Math.round(155 - 55 * digital)},${Math.round(165 - 50 * digital)},${1 - 0.55 * digital})`;
  const metalDark = `rgba(${Math.round(95 - 40 * digital)},${Math.round(100 - 40 * digital)},${Math.round(110 - 40 * digital)},${1 - 0.55 * digital})`;
  const edge = digital > 0.05 ? `rgba(56,214,240,${0.25 + 0.6 * digital})` : 'rgba(0,0,0,0.35)';
  const strokeW = 1 + 1.2 * digital;
  return (
    <svg width={W} height={H} style={{overflow: 'visible', opacity}}>
      <defs>
        <radialGradient id="arcGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.95} />
          <stop offset="25%" stopColor={colors.neuralSoft} stopOpacity={0.8} />
          <stop offset="60%" stopColor={colors.neuralHot} stopOpacity={0.35} />
          <stop offset="100%" stopColor={colors.neuralHot} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="beadGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#B9C2CC" />
          <stop offset="50%" stopColor="#6F7A88" />
          <stop offset="100%" stopColor="#3B434E" />
        </linearGradient>
      </defs>
      {/* floor shadow */}
      <ellipse cx={485 * sx} cy={400 * sy} rx={380 * sx} ry={40 * sy} fill="rgba(0,0,0,0.35)" opacity={1 - digital} />
      {/* plates */}
      <polygon points={hPlateSide} fill={metalDark} stroke={edge} strokeWidth={strokeW} />
      <polygon points={hPlate} fill={metal} stroke={edge} strokeWidth={strokeW} />
      <polygon points={vPlate} fill={metalDark} stroke={edge} strokeWidth={strokeW} />
      <polygon points={vPlateTop} fill={metal} stroke={edge} strokeWidth={strokeW} />
      {/* joint line */}
      <line x1={jx0 * sx} y1={jy * sy} x2={jx1 * sx} y2={jy * sy} stroke={digital > 0.05 ? colors.symbolic : 'rgba(0,0,0,0.5)'} strokeWidth={1} strokeDasharray={digital > 0.05 ? '4 4' : undefined} opacity={0.6} />
      {/* bead */}
      {beadW > 0 ? (
        <g>
          <rect x={jx0 * sx} y={(jy - 9) * sy} width={beadW * sx} height={18 * sy} rx={9 * sy} fill={digital > 0.5 ? 'none' : 'url(#beadGrad)'} stroke={digital > 0.05 ? `rgba(245,165,36,${0.5 + 0.5 * digital})` : 'rgba(30,30,30,0.6)'} strokeWidth={1} />
          {/* ripples */}
          {Array.from({length: Math.floor(beadW / 14)}).map((_, i) => (
            <path key={i} d={`M ${(jx0 + 8 + i * 14) * sx} ${(jy - 6) * sy} q ${5 * sx} ${6 * sy} 0 ${12 * sy}`} fill="none" stroke={digital > 0.5 ? colors.neural : 'rgba(255,255,255,0.28)'} strokeWidth={0.8} opacity={digital > 0.5 ? 0.6 : 1} />
          ))}
          {/* cooling glow behind the arc */}
          <rect x={Math.max(jx0, tx - 70) * sx} y={(jy - 9) * sy} width={Math.min(70, beadW) * sx} height={18 * sy} rx={9 * sy} fill={colors.neuralHot} opacity={0.55 * arc * (1 - digital)} />
        </g>
      ) : null}
      {/* torch */}
      <g transform={`translate(${tx * sx}, ${(jy - 12) * sy})`}>
        <line x1={0} y1={0} x2={38 * sx} y2={-110 * sy} stroke={digital > 0.05 ? colors.symbolic : '#2B313A'} strokeWidth={10 * sx} strokeLinecap="round" opacity={digital > 0.05 ? 0.7 : 1} />
        <line x1={38 * sx} y1={-110 * sy} x2={120 * sx} y2={-160 * sy} stroke={digital > 0.05 ? colors.symbolic : '#3A424D'} strokeWidth={14 * sx} strokeLinecap="round" opacity={digital > 0.05 ? 0.7 : 1} />
        <circle cx={38 * sx} cy={-110 * sy} r={9 * sx} fill={digital > 0.05 ? colors.bg : '#4A5361'} stroke={digital > 0.05 ? colors.symbolic : '#1C2129'} />
        <line x1={0} y1={0} x2={9 * sx} y2={-26 * sy} stroke="#C9CED6" strokeWidth={3 * sx} opacity={1 - digital} />
      </g>
      {/* arc */}
      {arc > 0 ? <circle cx={tx * sx} cy={jy * sy} r={(28 + 10 * Math.sin(travel * 60)) * sx * arc} fill="url(#arcGlow)" /> : null}
      {/* spark specks (deterministic) */}
      {arc > 0
        ? Array.from({length: 7}).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 + travel * 40;
            const r = (18 + ((i * 37) % 22)) * sx * arc;
            return <circle key={i} cx={tx * sx + Math.cos(a) * r} cy={jy * sy + Math.sin(a) * r * 0.5} r={1.6 * sx} fill={colors.neuralSoft} opacity={0.8 * arc * (1 - digital)} />;
          })
        : null}
      {/* labels in digital mode */}
      {digital > 0.4 ? (
        <g fontFamily={fonts.mono} fontSize={12 * sx} fill={colors.symbolicSoft} opacity={(digital - 0.4) / 0.6} letterSpacing="0.14em">
          <text x={280 * sx} y={135 * sy}>
            VERTICAL PLATE · Fe410 · 7 mm
          </text>
          <text x={160 * sx} y={420 * sy}>
            HORIZONTAL PLATE · FILLET JOINT
          </text>
          <text x={(tx + 20) * sx} y={(jy - 130) * sy}>
            ROBOT TORCH · CO2 MAG
          </text>
        </g>
      ) : null}
    </svg>
  );
};
