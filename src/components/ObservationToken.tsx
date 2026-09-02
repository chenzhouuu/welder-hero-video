import React from 'react';
import {colors, fonts} from '../styles/tokens';

type Props = {
  k: string;
  v: string;
  /** warm = neural output still glowing; cool = symbolic token */
  tone?: 'warm' | 'cool' | 'abnormal' | 'nominal' | 'neutral';
  /** 0..1 appearance progress */
  appear?: number;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  sub?: string;
};

const toneColor = (tone: NonNullable<Props['tone']>): string =>
  tone === 'warm' ? colors.neural : tone === 'cool' ? colors.symbolic : tone === 'abnormal' ? colors.abnormal : tone === 'nominal' ? colors.nominal : colors.textMuted;

/** A structured observation rendered as an inspectable KEY = VALUE chip. */
export const ObservationToken: React.FC<Props> = ({k, v, tone = 'cool', appear = 1, size = 'md', style, sub}) => {
  const c = toneColor(tone);
  const fs = size === 'sm' ? 15 : size === 'lg' ? 24 : 18;
  const pad = size === 'sm' ? '6px 12px' : size === 'lg' ? '14px 22px' : '10px 16px';
  const a = Math.max(0, Math.min(1, appear));
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 2,
        padding: pad,
        borderRadius: 8,
        border: `1px solid ${c}`,
        background: `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.12))`,
        boxShadow: `0 0 ${18 * a}px ${tone === 'warm' || tone === 'abnormal' ? colors.neuralGlow : colors.symbolicGlow}`,
        opacity: a,
        transform: `translateY(${(1 - a) * 14}px) scale(${0.96 + 0.04 * a})`,
        fontFamily: fonts.mono,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
        <span style={{fontSize: fs * 0.72, letterSpacing: '0.16em', color: colors.textMuted, textTransform: 'uppercase'}}>{k}</span>
        <span style={{fontSize: fs * 0.72, color: colors.textDim}}>=</span>
        <span style={{fontSize: fs, fontWeight: 600, color: c, letterSpacing: '0.02em'}}>{v}</span>
      </div>
      {sub ? <div style={{fontSize: fs * 0.66, color: colors.textDim, letterSpacing: '0.02em'}}>{sub}</div> : null}
    </div>
  );
};
