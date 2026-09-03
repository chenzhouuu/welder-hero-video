import React from 'react';
import {colors, fonts} from '../styles/tokens';
import {Kicker} from './Text';

/** Generic panel. */
export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string; appear?: number}> = ({children, style, accent, appear = 1}) => (
  <div
    style={{
      position: 'relative',
      background: `linear-gradient(180deg, rgba(255,255,255,0.025), rgba(0,0,0,0.10))`,
      border: `1px solid ${colors.panelEdge}`,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      borderRadius: 12,
      padding: '18px 22px',
      opacity: Math.max(0, Math.min(1, appear)),
      transform: `translateY(${(1 - Math.max(0, Math.min(1, appear))) * 16}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A rule evaluated against an observation; shows the check outcome. */
export const RuleCard: React.FC<{
  title: string;
  rule: string;
  observed?: string;
  outcome?: 'violated' | 'satisfied' | 'pending';
  source?: string;
  appear?: number;
  style?: React.CSSProperties;
  width?: number;
}> = ({title, rule, observed, outcome = 'pending', source, appear = 1, style, width}) => {
  const oc = outcome === 'violated' ? colors.weakened : outcome === 'satisfied' ? colors.supported : colors.textDim;
  const ot = outcome === 'violated' ? 'VIOLATED' : outcome === 'satisfied' ? 'SATISFIED' : '…';
  return (
    <Panel accent={colors.symbolic} appear={appear} style={{width, ...style}}>
      <Kicker color={colors.symbolic} size={12}>
        {title}
      </Kicker>
      <div style={{fontFamily: fonts.mono, fontSize: 21, color: colors.text, marginTop: 8, whiteSpace: 'pre-wrap', lineHeight: 1.4}}>{rule}</div>
      {observed ? (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10, gap: 12}}>
          <div style={{fontFamily: fonts.mono, fontSize: 18, color: colors.neural}}>{observed}</div>
          <div style={{fontFamily: fonts.mono, fontSize: 14, letterSpacing: '0.16em', color: oc, fontWeight: 700}}>{ot}</div>
        </div>
      ) : null}
      {source ? <div style={{fontFamily: fonts.mono, fontSize: 13, color: colors.textDim, marginTop: 8, letterSpacing: '0.06em'}}>{source}</div> : null}
    </Panel>
  );
};

export type Verdict = 'PENDING' | 'WEAKENED' | 'SUPPORTED' | 'PLAUSIBLE, UNVERIFIED' | 'PLAUSIBLE, UNOBSERVED';

const verdictColor = (v: Verdict): string => (v === 'SUPPORTED' ? colors.supported : v === 'WEAKENED' ? colors.weakened : v === 'PENDING' ? colors.textDim : colors.plausible);

/** Hypothesis with its prediction, the observed evidence, and the verdict. */
export const HypothesisCard: React.FC<{
  id: string;
  name: string;
  mechanism: string;
  predicts: string;
  observed?: string;
  verdict: Verdict;
  appear?: number;
  /** 0..1 progress of the evidence row */
  evidence?: number;
  width?: number;
  compact?: boolean;
  style?: React.CSSProperties;
}> = ({id, name, mechanism, predicts, observed, verdict, appear = 1, evidence = 1, width = 560, compact = false, style}) => {
  const vc = verdictColor(verdict);
  const dim = verdict === 'WEAKENED' ? 0.62 : 1;
  return (
    <Panel appear={appear} accent={vc} style={{width, opacity: appear * dim, padding: compact ? '12px 16px' : '16px 20px', ...style}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
        <span style={{fontFamily: fonts.mono, fontSize: 13, letterSpacing: '0.16em', color: colors.textDim}}>{id}</span>
        <span style={{fontFamily: fonts.sans, fontSize: compact ? 23 : 25, fontWeight: 600, color: colors.text}}>{name}</span>
        <span style={{marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 14, letterSpacing: '0.16em', color: vc, fontWeight: 700}}>{verdict}</span>
      </div>
      {!compact ? <div style={{fontFamily: fonts.sans, fontSize: 15, color: colors.textDim, marginTop: 2}}>{mechanism}</div> : null}
      <div style={{display: 'grid', gridTemplateColumns: '92px 1fr', rowGap: 4, columnGap: 12, marginTop: compact ? 6 : 10, fontFamily: fonts.mono, fontSize: compact ? 15 : 16, lineHeight: 1.38}}>
        <span style={{color: colors.symbolic, letterSpacing: '0.12em'}}>PREDICTS</span>
        <span style={{color: colors.textMuted}}>{predicts}</span>
        {observed ? (
          <>
            <span style={{color: colors.neural, letterSpacing: '0.12em', opacity: evidence}}>OBSERVED</span>
            <span style={{color: colors.text, opacity: evidence}}>{observed}</span>
          </>
        ) : null}
      </div>
    </Panel>
  );
};

/** Action recommendation card. */
export const ActionCard: React.FC<{title: string; lines: string[]; accent?: string; appear?: number; width?: number; tag?: string; style?: React.CSSProperties}> = ({title, lines, accent = colors.symbolic, appear = 1, width = 520, tag, style}) => (
  <Panel accent={accent} appear={appear} style={{width, ...style}}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
      <Kicker color={accent} size={15}>
        {title}
      </Kicker>
      {tag ? <span style={{marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 13, letterSpacing: '0.14em', color: colors.textDim}}>{tag}</span> : null}
    </div>
    <ul style={{margin: '14px 0 0 0', paddingLeft: 20, fontFamily: fonts.sans, fontSize: 23, lineHeight: 1.45, color: colors.text}}>
      {lines.map((l, i) => (
        <li key={i} style={{marginBottom: 4}}>
          {l}
        </li>
      ))}
    </ul>
  </Panel>
);

/** FAST / SLOW route indicator. */
export const RouterBadge: React.FC<{mode: 'fast' | 'slow'; blend?: number; style?: React.CSSProperties}> = ({mode, blend = 1, style}) => {
  const slow = mode === 'slow';
  const c = slow ? colors.symbolic : colors.neural;
  return (
    <div style={{display: 'flex', gap: 8, alignItems: 'center', fontFamily: fonts.mono, ...style}}>
      <div style={{fontSize: 12, letterSpacing: '0.18em', color: colors.textDim}}>ROUTE</div>
      <div style={{display: 'flex', border: `1px solid ${colors.panelEdge}`, borderRadius: 999, overflow: 'hidden'}}>
        <div style={{padding: '8px 18px', fontSize: 15, letterSpacing: '0.16em', fontWeight: 700, color: slow ? colors.textDim : colors.bg, background: slow ? 'transparent' : colors.neural, opacity: slow ? 1 : blend}}>
          FAST · monitor
        </div>
        <div style={{padding: '8px 18px', fontSize: 15, letterSpacing: '0.16em', fontWeight: 700, color: slow ? colors.bg : colors.textDim, background: slow ? colors.symbolic : 'transparent', opacity: slow ? blend : 1}}>
          SLOW · reason
        </div>
      </div>
      <div style={{fontSize: 14, color: c, letterSpacing: '0.1em'}}>{slow ? 'observations require reasoning' : 'observations sufficient'}</div>
    </div>
  );
};

/** Straight SVG connector with draw progress; absolute-positioned overlay. */
export const EvidenceLink: React.FC<{x1: number; y1: number; x2: number; y2: number; progress: number; color?: string; dashed?: boolean; width?: number}> = ({x1, y1, x2, y2, progress, color = colors.neural, dashed = true, width = 1.6}) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0) return null;
  const mx = x1 + (x2 - x1) * p;
  const my = y1 + (y2 - y1) * p;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', overflow: 'visible'}} width={1920} height={1080}>
      <line x1={x1} y1={y1} x2={mx} y2={my} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '6 6' : undefined} opacity={0.9} />
      <circle cx={mx} cy={my} r={3.5} fill={color} />
    </svg>
  );
};
