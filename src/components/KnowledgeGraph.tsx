import React from 'react';
import {colors, fonts} from '../styles/tokens';

export type GNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: 'defect' | 'cause' | 'remedy' | 'criterion' | 'observation' | 'mechanism';
  sub?: string;
};

export type GEdge = {
  from: string;
  to: string;
  weight?: number;
  label?: string;
  kind?: 'cause' | 'remedy' | 'criterion' | 'link' | 'absent';
};

type Props = {
  nodes: GNode[];
  edges: GEdge[];
  width: number;
  height: number;
  /** per-node reveal 0..1 keyed by id (missing = 1) */
  reveal?: Record<string, number>;
  /** per-edge reveal 0..1 keyed by `${from}>${to}` (missing = 1) */
  edgeReveal?: Record<string, number>;
  /** ids to emphasise */
  highlight?: string[];
  dimOthers?: boolean;
  opacity?: number;
};

const kindColor = (k: GNode['kind']): string =>
  k === 'defect' ? colors.neuralHot : k === 'cause' ? colors.symbolic : k === 'remedy' ? colors.supported : k === 'criterion' ? colors.plausible : k === 'observation' ? colors.neural : colors.symbolicSoft;

const kindTag = (k: GNode['kind']): string =>
  k === 'defect' ? 'WELD_DEFECT' : k === 'cause' ? 'PROCESS_CONDITION' : k === 'remedy' ? 'CORRECTIVE_ACTION' : k === 'criterion' ? 'ACCEPTANCE_CRITERION' : k === 'observation' ? 'OBSERVATION' : 'PHYSICAL_MECHANISM';

/** Typed knowledge-graph rendering with progressive edge drawing. */
export const KnowledgeGraph: React.FC<Props> = ({nodes, edges, width, height, reveal = {}, edgeReveal = {}, highlight = [], dimOthers = false, opacity = 1}) => {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const isHi = (id: string): boolean => highlight.length === 0 || highlight.includes(id);
  return (
    <svg width={width} height={height} style={{overflow: 'visible', opacity}}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.symbolic} />
        </marker>
        <marker id="arrG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.supported} />
        </marker>
        <marker id="arrY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={colors.plausible} />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = byId[e.from];
        const b = byId[e.to];
        if (!a || !b) return null;
        const p = Math.max(0, Math.min(1, edgeReveal[`${e.from}>${e.to}`] ?? 1));
        if (p <= 0) return null;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const r0 = 14;
        const r1 = 16;
        const x0 = a.x + ux * r0;
        const y0 = a.y + uy * r0;
        const x1 = a.x + ux * (len - r1) * p;
        const y1 = a.y + uy * (len - r1) * p;
        const w = 1 + Math.min(4, ((e.weight ?? 8) / 18) * 4);
        const stroke = e.kind === 'remedy' ? colors.supported : e.kind === 'criterion' ? colors.plausible : e.kind === 'link' ? colors.neural : e.kind === 'absent' ? colors.weakened : colors.symbolic;
        const marker = e.kind === 'remedy' ? 'url(#arrG)' : e.kind === 'criterion' ? 'url(#arrY)' : e.kind === 'link' || e.kind === 'absent' ? undefined : 'url(#arr)';
        const dim = dimOthers && !(isHi(e.from) && isHi(e.to));
        return (
          <g key={`${e.from}>${e.to}`} opacity={dim ? 0.18 : 0.85}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={stroke} strokeWidth={w} strokeDasharray={e.kind === 'link' ? '5 5' : e.kind === 'absent' ? '3 6' : undefined} markerEnd={p >= 0.99 ? marker : undefined} />
            {e.label && p >= 0.99 ? (
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 8} fill={stroke} fontFamily={fonts.mono} fontSize={13} textAnchor="middle" letterSpacing="0.08em">
                {e.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {nodes.map((n) => {
        const p = Math.max(0, Math.min(1, reveal[n.id] ?? 1));
        if (p <= 0) return null;
        const c = kindColor(n.kind);
        const dim = dimOthers && !isHi(n.id);
        const big = n.kind === 'defect';
        const w = Math.max(120, n.label.length * 9.4 + 30);
        const h = big ? 56 : 42;
        return (
          <g key={n.id} transform={`translate(${n.x},${n.y}) scale(${0.85 + 0.15 * p})`} opacity={p * (dim ? 0.25 : 1)}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={big ? 10 : 7} fill={colors.bg2} stroke={c} strokeWidth={big ? 2 : 1.2} />
            <text x={0} y={big ? 2 : 4} fill={c} fontFamily={fonts.mono} fontSize={big ? 17 : 13} fontWeight={700} textAnchor="middle" letterSpacing="0.06em">
              {n.label}
            </text>
            <text x={0} y={-h / 2 - 5} fill={colors.textDim} fontFamily={fonts.mono} fontSize={10} textAnchor="middle" letterSpacing="0.14em">
              {kindTag(n.kind)}
            </text>
            {n.sub ? (
              <text x={0} y={h / 2 + 14} fill={colors.textDim} fontFamily={fonts.mono} fontSize={10} textAnchor="middle">
                {n.sub}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
