import React from 'react';
import {Band, Link, Value, type LinkState} from '../../components/marks';
import {laneScales, type Lane} from '../../components/TraceLane';
import {bow, partialQuad, quadAt, type Pt} from '../../lib/geom';
import {tokens} from '../../styles/tokens';
import {track, lin, on, off, win} from '../../lib/track';
import {GOOD_WINDOW_A, PLATEAU, PLATEAU_ROWS, signals} from '../../data/hero';
import {HYPOTHESES, LABELS} from '../../data/story';
import {T, HERO_THUMB} from '../layout';

const R = T.reason.t0;
const K = T.cause.t0;
const M = T.memory.t0;
/** Start of each mechanism's test (story seconds). */
const H_T0 = [R + 2.2, R + 7.2, R + 12.2];
/** Beats inside a test: edge to evidence, evidence highlight, verdict. */
const B = {edge: 0.4, edgeEnd: 1.4, evid: 1.5, verdict: 3.6};
const WORD_Y = 430;
const COL_X = [380, 960, 1540];
const PLATEAU_T: [number, number] = [signals.t[PLATEAU_ROWS[0]], signals.t[PLATEAU_ROWS[1]]];

type Props = {t: number; groove: Pt; defectChip: Pt; lanes: Lane[]};

/** A short symbolic relation written on an edge (mechanism → expected evidence). SVG text. */
const EdgeWord: React.FC<{at: Pt; text: string; opacity: number; hue?: string}> = ({at, text, opacity, hue = tokens.inkSoft}) => (
  <text x={at.x + 14} y={at.y - 10} fontSize={22} fontWeight={500} fill={hue} opacity={opacity} fontFamily={tokens.font} style={{whiteSpace: 'pre'}}>
    {text}
  </text>
);

/**
 * Chapters 5–6, on the evidence. Knowledge fans out from the finding (defect → candidate
 * mechanisms); each mechanism sends an edge back into the neural evidence it predicts —
 * the traces, the reference window, the toe morphology — and the state of that edge is the
 * test. No table: mechanism words, edges, evidence highlights, one verdict word each.
 */
export const ReasonPart: React.FC<Props> = ({t, groove, defectChip, lanes}) => {
  const cur = lanes[0];
  const volt = lanes[1];
  const {x: xc, y: yc} = laneScales(cur);
  const {x: xv, y: yv} = laneScales(volt);
  const px0 = xc(PLATEAU_T[0]);
  const px1 = xc(PLATEAU_T[1]);
  const plateauI: Pt = {x: xc(10), y: yc(PLATEAU.current_A) - 14};
  const plateauV: Pt = {x: xv(10), y: yv(PLATEAU.voltage_V) - 12};
  const plateauR: Pt = {x: xc(27), y: yc(PLATEAU.current_A) - 14};
  const wy0 = yc(GOOD_WINDOW_A[1]);
  const wy1 = yc(GOOD_WINDOW_A[0]);
  const GAP_T = 18.5;
  const windowTop: Pt = {x: xc(GAP_T), y: wy0};

  // chapter 5: fan-out from the finding, then three tests
  const fan = lin(t, R + 0.6, R + 1.8);
  const stacksOn = off(t, K + 3.6, K + 4.6); // everything collapses into the record
  const recordOn = on(t, K + 4.0, K + 4.8);
  // chapter 6: H3 to the front, H2 aside, H1 gone
  const re = track(t, [[K, 0], [K + 1.2, 1]]);
  const colX = [COL_X[0], COL_X[1] + (1460 - COL_X[1]) * re, COL_X[2] + (760 - COL_X[2]) * re];
  const colScale = [1 - 0.12 * on(t, H_T0[0] + B.verdict, H_T0[0] + B.verdict + 0.6), 1 - 0.15 * re, 1 + 0.12 * on(t, H_T0[2] + B.verdict, H_T0[2] + B.verdict + 0.6) + 0.1 * re];
  const colOp = [off(t, K, K + 1.0), 1 - 0.25 * re, 1];
  // record line travels from the band centre to the thumbnail's label position
  const rec = track(t, [[M + 0.3, 0], [M + 1.5, 1]]);
  const recX = 960 + (HERO_THUMB.x - 960) * rec;
  const recY = WORD_Y + 30 + (HERO_THUMB.y + HERO_THUMB.h + 10 - (WORD_Y + 30)) * rec;
  const recSize = 32 + (24 - 32) * rec;
  const recOp = recordOn * off(t, M + 1.45, M + 1.55);

  const h1 = H_T0[0];
  const h2 = H_T0[1];
  const h3 = H_T0[2];
  const h1Weak = t >= h1 + B.verdict;
  const h3Strong = t >= h3 + B.verdict;
  const wordTop = (i: number): Pt => ({x: colX[i], y: WORD_Y - 6 + 44 * re});
  const wordBot = (i: number): Pt => ({x: colX[i], y: WORD_Y + 46 + 44 * re});
  const edgeState = (i: number): LinkState => (i === 0 ? (h1Weak ? 'refuted' : 'pending') : i === 2 && h3Strong ? 'supported' : 'pending');
  const edge = (i: number, to: Pt, bowAmt: number, t0: number, label?: string, width = 2.5, dim = 1, labelAt = 0.5): React.ReactNode => {
    const from = wordBot(i);
    const c = bow(from, to, bowAmt);
    const drawn = lin(t, t0, t0 + (B.edgeEnd - B.edge));
    const op = on(t, t0, t0 + 0.2) * colOp[i] * stacksOn * dim;
    const mid = quadAt(from, c, to, labelAt);
    return (
      <React.Fragment key={`${i}-${to.x}-${to.y}`}>
        <Link d={partialQuad(from, c, to, drawn)} hue={tokens.slow} state={edgeState(i)} opacity={op} width={width} />
        {label ? <EdgeWord at={mid} text={label} opacity={op * on(t, t0 + 0.9, t0 + 1.2) * (i === 0 && h1Weak ? 0.5 : 1) * (1 - re)} /> : null}
      </React.Fragment>
    );
  };
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {/* defect → candidate mechanisms (kb-v1 cause edges), from the finding on the photo */}
        {HYPOTHESES.map((h, i) => {
          const to = wordTop(i);
          const c = bow(defectChip, to, i === 0 ? 0.12 : i === 2 ? -0.12 : 0.02);
          return <Link key={h.id} d={partialQuad(defectChip, c, to, fan)} hue={tokens.slow} state="pending" opacity={0.55 * colOp[i] * stacksOn} width={1.6} />;
        })}
        {/* H1: the stable plateau on both traces is the evidence; the highlight is the fast finding itself */}
        <g opacity={win(t, h1 + B.evid, h1 + B.evid + 0.5, K + 3.6, K + 4.6)}>
          <Band x0={px0} x1={px1} y0={cur.y} y1={cur.y + cur.h} hue={tokens.fast} alpha={0.14} />
          <Band x0={xv(PLATEAU_T[0])} x1={xv(PLATEAU_T[1])} y0={volt.y} y1={volt.y + volt.h} hue={tokens.fast} alpha={0.14} />
        </g>
        {edge(0, plateauI, -0.1, h1 + B.edge, 'expects erratic I / V')}
        {edge(0, plateauV, -0.06, h1 + B.edge + 0.15)}
        {/* H2: the qualified window (p5–p95 of good welds) is the symbolic constraint the level is tested against */}
        <g opacity={win(t, h2 + B.evid, h2 + B.evid + 0.7, K + 3.6, K + 4.6)}>
          <Band x0={cur.x} x1={cur.x + cur.w} y0={wy0} y1={wy1} hue={tokens.slow} alpha={0.13} />
          <line x1={cur.x} x2={cur.x + cur.w} y1={wy0} y2={wy0} stroke={tokens.slow} strokeWidth={1.2} opacity={0.7} />
          <line x1={cur.x} x2={cur.x + cur.w} y1={wy1} y2={wy1} stroke={tokens.slow} strokeWidth={1.2} opacity={0.7} />
          {/* the gap between the plateau and the window */}
          <line x1={xc(GAP_T)} x2={xc(GAP_T)} y1={plateauI.y + 14} y2={wy0} stroke={tokens.slow} strokeWidth={1.5} strokeDasharray="4 5" opacity={on(t, h2 + B.evid + 0.6, h2 + B.evid + 1.0)} />
        </g>
        {edge(1, windowTop, 0.08, h2 + B.edge, 'expects level above qualified window')}
        {/* H3: the toe morphology is the evidence; a thin second edge says it is compatible with the stable traces */}
        {edge(2, groove, -0.14, h3 + B.edge, 'expects one-sided toe groove', 2.5)}
        {edge(2, plateauR, 0.12, h3 + B.evid + 0.8, 'compatible with stable I / V', 1.5, 0.7, 0.78)}
        {/* the groove pulses when tested */}
        <circle cx={groove.x} cy={groove.y - 6} r={10 + 26 * ((t * 1.3) % 1)} fill="none" stroke={tokens.fast} strokeWidth={2} opacity={win(t, h3 + B.evid, h3 + B.evid + 0.3, h3 + B.verdict, h3 + B.verdict + 0.4) * (1 - ((t * 1.3) % 1))} />
      </svg>
      {/* the window's name, once; and the distinction the reasoning turns on */}
      <Value x={cur.x + cur.w - 8} y={wy0 - 32} text={`qualified window ${GOOD_WINDOW_A[0]}–${GOOD_WINDOW_A[1]} A`} size={22} hue={tokens.slow} align="right" opacity={win(t, h2 + B.evid + 0.3, h2 + B.evid + 0.8, K + 3.6, K + 4.6)} />
      <Value x={cur.x + cur.w - 8} y={wy0 - 64} text="stable ≠ optimal" size={26} hue={tokens.inkSoft} align="right" opacity={win(t, h2 + B.verdict + 0.4, h2 + B.verdict + 0.9, K + 3.6, K + 4.6)} />
      {HYPOTHESES.map((h, i) => {
        const t0 = H_T0[i];
        const decided = t >= t0 + B.verdict;
        const weak = i === 0 && decided;
        const verdictHue = h.verdict === 'weakened' ? tokens.inkSoft : h.verdict === 'likely' ? tokens.slow : tokens.slow;
        const over = i === 2 ? 'likely mechanism' : i === 1 ? 'also consistent' : '';
        return (
          <div key={h.id} style={{position: 'absolute', left: colX[i], top: 44 * re, transform: `translateX(-50%) scale(${colScale[i]})`, transformOrigin: '50% 0', opacity: colOp[i] * stacksOn, width: 520, textAlign: 'center'}}>
            <Value x={260} y={WORD_Y - 42} text={over} size={24} hue={tokens.inkSoft} align="center" opacity={on(t, K + 1.3, K + 1.9)} />
            <div style={{position: 'absolute', left: 260, top: WORD_Y, transform: 'translateX(-50%)', fontSize: 38, fontWeight: i === 2 && h3Strong ? 600 : 500, lineHeight: 1, color: weak ? tokens.inkSoft : tokens.slow, whiteSpace: 'nowrap', letterSpacing: -0.3, opacity: on(t, R + 0.6 + i * 0.3, R + 1.2 + i * 0.3)}}>
              {h.name}
            </div>
            <Value x={260} y={WORD_Y + 60} text={h.verdict} size={28} hue={verdictHue} align="center" opacity={on(t, t0 + B.verdict, t0 + B.verdict + 0.4) * (i === 0 ? 1 : 1)} />
          </div>
        );
      })}
      {/* the diagnosis as a record: ID · finding · mechanism */}
      <div style={{position: 'absolute', left: recX, top: recY, transform: rec < 0.999 ? 'translateX(-50%)' : 'none', opacity: recOp, whiteSpace: 'nowrap', fontSize: recSize, fontWeight: 500, lineHeight: 1, letterSpacing: -0.2}}>
        <span style={{color: tokens.ink, fontVariantNumeric: 'tabular-nums'}}>{LABELS.weld}</span>
        <span style={{color: tokens.inkSoft}}> · </span>
        <span style={{color: tokens.fast}}>undercut</span>
        <span style={{color: tokens.inkSoft}}> · </span>
        <span style={{color: tokens.slow}}>torch / travel</span>
      </div>
    </>
  );
};
