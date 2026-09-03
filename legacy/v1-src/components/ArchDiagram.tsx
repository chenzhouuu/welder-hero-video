import React from 'react';
import {colors, fonts} from '../styles/tokens';

type Stage = {label: string; sub?: string; tone: 'input' | 'neural' | 'bridge' | 'symbolic' | 'output'};

type Props = {
  stages: Stage[];
  width: number;
  /** per-stage reveal 0..1 */
  reveal: number[];
  /** index of a stage to pulse */
  active?: number;
  height?: number;
};

const toneColor = (t: Stage['tone']): string => (t === 'neural' ? colors.neural : t === 'symbolic' ? colors.symbolic : t === 'bridge' ? colors.symbolicSoft : t === 'output' ? colors.supported : colors.textMuted);

/** Horizontal pipeline of stages with arrows; used for the WHAT→WHY contrast and the vision diagram. */
export const ArchDiagram: React.FC<Props> = ({stages, width, reveal, active, height = 120}) => {
  const n = stages.length;
  const gap = 34;
  const boxW = (width - gap * (n - 1)) / n;
  return (
    <div style={{position: 'relative', width, height}}>
      {stages.map((s, i) => {
        const c = toneColor(s.tone);
        const r = Math.max(0, Math.min(1, reveal[i] ?? 1));
        const x = i * (boxW + gap);
        const pulse = active === i ? 1 : 0;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: x,
                top: 0,
                width: boxW,
                height,
                borderRadius: 10,
                border: `1.5px solid ${c}`,
                background: `rgba(255,255,255,${0.02 + 0.06 * pulse})`,
                boxShadow: pulse ? `0 0 26px ${c}55` : undefined,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                opacity: r,
                transform: `scale(${0.9 + 0.1 * r})`,
                padding: '0 10px',
                textAlign: 'center',
              }}
            >
              <div style={{fontFamily: fonts.mono, fontSize: 14, letterSpacing: '0.14em', color: c, fontWeight: 700}}>{s.label}</div>
              {s.sub ? <div style={{fontFamily: fonts.sans, fontSize: 14, color: colors.textMuted, lineHeight: 1.25}}>{s.sub}</div> : null}
            </div>
            {i < n - 1 ? (
              <svg style={{position: 'absolute', left: x + boxW, top: height / 2 - 10}} width={gap} height={20}>
                <line x1={2} y1={10} x2={gap - 8} y2={10} stroke={colors.textDim} strokeWidth={1.5} opacity={Math.min(r, reveal[i + 1] ?? 1)} />
                <polygon points={`${gap - 8},5 ${gap - 8},15 ${gap - 1},10`} fill={colors.textDim} opacity={Math.min(r, reveal[i + 1] ?? 1)} />
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
