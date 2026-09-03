import React from 'react';
import {colors, fonts, type} from '../styles/tokens';

type Base = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  color?: string;
};

/** Small-caps tracking label (section kickers, token keys). */
export const Kicker: React.FC<Base & {size?: number}> = ({children, style, color = colors.textMuted, size = type.micro}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: Math.max(size, 13),
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<Base & {size?: number; weight?: number}> = ({children, style, color = colors.text, size = type.h1, weight = 600}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: '-0.02em',
      lineHeight: 1.08,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<Base & {size?: number}> = ({children, style, color = colors.textMuted, size = type.body}) => (
  <div style={{fontFamily: fonts.sans, fontSize: size, lineHeight: 1.35, color, fontWeight: 400, ...style}}>{children}</div>
);

export const Mono: React.FC<Base & {size?: number; weight?: number}> = ({children, style, color = colors.text, size = type.small, weight = 500}) => (
  <div style={{fontFamily: fonts.mono, fontSize: size, lineHeight: 1.3, color, fontWeight: weight, ...style}}>{children}</div>
);

/** Tiny label naming the provenance class of an on-screen element. */
export const ProvenanceTag: React.FC<{kind: 'measured' | 'kb-v1' | 'intended' | 'illustrative' | 'model output'; style?: React.CSSProperties}> = ({kind, style}) => {
  const c =
    kind === 'measured' ? colors.neuralSoft : kind === 'kb-v1' ? colors.symbolicSoft : kind === 'model output' ? colors.supported : colors.textDim;
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: fonts.mono,
        fontSize: 13,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: c,
        border: `1px solid ${c}`,
        borderRadius: 4,
        padding: '2px 7px',
        opacity: 0.85,
        ...style,
      }}
    >
      {kind}
    </div>
  );
};

/** Persistent corner brand + disclosure footer used on every scene. */
export const Chrome: React.FC<{disclosure?: string; opacity?: number; disclosureOpacity?: number}> = ({disclosure, opacity = 1, disclosureOpacity = 1}) => (
  <>
    <div style={{position: 'absolute', left: 56, top: 40, display: 'flex', alignItems: 'baseline', gap: 14, opacity}}>
      <span style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: '0.08em', color: colors.text}}>WELDER</span>
      <span style={{fontFamily: fonts.mono, fontSize: 13, letterSpacing: '0.16em', color: colors.textDim, textTransform: 'uppercase'}}>
        neural-symbolic manufacturing AI
      </span>
    </div>
    {disclosure ? (
      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          bottom: 30,
          fontFamily: fonts.mono,
          fontSize: 13,
          color: colors.textDim,
          letterSpacing: '0.02em',
          opacity: opacity * disclosureOpacity,
        }}
      >
        {disclosure}
      </div>
    ) : null}
  </>
);
