import React from 'react';
import {Band, Link, Value, type LinkState} from '../../components/marks';
import {laneScales, type Lane} from '../../components/TraceLane';
import {bow, partialQuad, type Pt} from '../../lib/geom';
import {tokens} from '../../styles/tokens';
import {track, lin, on, off, win} from '../../lib/track';
import {GOOD_WINDOW_A, PLATEAU} from '../../data/hero';
import {HYPOTHESES, LABELS} from '../../data/story';
import {T, HERO_THUMB} from '../layout';

const R = T.reason.t0;
const K = T.cause.t0;
const M = T.memory.t0;
/** Start of each hypothesis test (story seconds) and the beat offsets inside a test. */
const H_T0 = [R + 0.5, R + 5.5, R + 11.0];
const B = {expects: 0.8, link: 1.1, linkEnd: 2.2, observed: 2.8, verdict: 3.8};
const COL_X = [330, 960, 1590];

type Props = {t: number; groove: Pt; lane: Lane; photoH: number};

/**
 * Chapters 5–6: manufacturing knowledge around the current case. Each mechanism is a small
 * stack — mechanism / expected evidence / observed evidence / verdict — that sends a line to
 * the evidence it is tested on. The graph then collapses into the likely mechanism and a
 * one-line record that becomes the weld's thumbnail label.
 */
export const ReasonPart: React.FC<Props> = ({t, groove, lane, photoH}) => {
  const {x: xt, y: yt} = laneScales(lane);
  const plateau: Pt = {x: xt(18.5), y: yt(PLATEAU.current_A) - 16};
  const wy0 = yt(GOOD_WINDOW_A[1]);
  const wy1 = yt(GOOD_WINDOW_A[0]);
  const bandTop = photoH + 10;
  const Y = {name: bandTop + 44, expects: bandTop + 104, observed: bandTop + 142, verdict: bandTop + 196};
  const collapse = on(t, K + 4.5, K + 5.5); // stacks fade into the record
  const recordOn = on(t, K + 5.0, K + 5.8);
  const stacksOn = 1 - collapse;
  // chapter-6 rearrangement: H2 to the front, H3 aside, H1 gone
  const re = track(t, [[K, 0], [K + 1.2, 1]]);
  const colX = [COL_X[0], COL_X[1] + (720 - COL_X[1]) * re, COL_X[2] + (1500 - COL_X[2]) * re];
  const colScale = [1, 1 + 0.15 * re, 1 - 0.15 * re];
  const colOp = [off(t, K, K + 1.0), 1, 1 - 0.3 * re];
  // record line travels from the band centre to the thumbnail's label position
  const rec = track(t, [[M + 0.3, 0], [M + 1.5, 1]]);
  const recX = 960 + (HERO_THUMB.x - 960) * rec;
  const recY = bandTop + 120 + (HERO_THUMB.y + HERO_THUMB.h + 10 - (bandTop + 120)) * rec;
  const recSize = 32 + (24 - 32) * rec;
  const recOp = recordOn * off(t, M + 1.45, M + 1.55);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {/* H3's reference window on the current lane */}
        <g opacity={win(t, H_T0[2] + 0.6, H_T0[2] + 1.4, K + 4.5, K + 5.5)}>
          <Band x0={lane.x} x1={lane.x + lane.w} y0={wy0} y1={wy1} hue={tokens.slow} alpha={0.12} />
          <line x1={lane.x} x2={lane.x + lane.w} y1={wy0} y2={wy0} stroke={tokens.slow} strokeWidth={1.2} opacity={0.7} />
          <line x1={lane.x} x2={lane.x + lane.w} y1={wy1} y2={wy1} stroke={tokens.slow} strokeWidth={1.2} opacity={0.7} />
        </g>
        {HYPOTHESES.map((h, i) => {
          const t0 = H_T0[i];
          const from: Pt = {x: colX[i], y: Y.verdict + 30};
          const drawn = lin(t, t0 + B.link, t0 + B.linkEnd);
          const decided = t >= t0 + B.verdict;
          const state: LinkState = decided ? (h.verdict === 'weakened' ? 'refuted' : 'supported') : 'pending';
          const opacity = on(t, t0 + B.link, t0 + B.link + 0.2) * colOp[i] * stacksOn;
          const targets: Pt[] = i === 1 ? [groove, plateau] : [plateau];
          return targets.map((to, j) => {
            const c = bow(from, to, i === 0 ? -0.12 : j === 0 && i === 1 ? 0.14 : 0.08);
            return <Link key={`${h.id}-${j}`} d={partialQuad(from, c, to, drawn)} hue={tokens.slow} state={state} opacity={opacity} width={2.5} />;
          });
        })}
      </svg>
      {HYPOTHESES.map((h, i) => {
        const t0 = H_T0[i];
        const decided = t >= t0 + B.verdict;
        const weak = decided && h.verdict === 'weakened';
        const nameHue = weak ? tokens.inkSoft : tokens.slow;
        const verdictHue = h.verdict === 'weakened' ? tokens.inkSoft : tokens.slow;
        const op = colOp[i] * stacksOn;
        const x = colX[i];
        const sc = colScale[i];
        const over = i === 1 ? 'likely mechanism' : i === 2 ? 'also consistent' : '';
        return (
          <div key={h.id} style={{position: 'absolute', left: x, top: 0, transform: `translateX(-50%) scale(${sc})`, transformOrigin: '50% 0', opacity: op, width: 620, textAlign: 'center'}}>
            <Value x={310} y={Y.name - 40} text={over} size={24} hue={tokens.inkSoft} align="center" opacity={on(t, K + 1.3, K + 1.9)} />
            <Value x={310} y={Y.name} text={h.name} size={36} hue={nameHue} align="center" opacity={on(t, t0, t0 + 0.4)} />
            <Value x={310} y={Y.expects} text={`expects  ${h.expects}`} size={25} hue={tokens.inkSoft} align="center" opacity={on(t, t0 + B.expects, t0 + B.expects + 0.4)} />
            <Value x={310} y={Y.observed} text={`observed  ${h.observed}`} size={25} hue={weak ? tokens.inkSoft : tokens.ink} align="center" opacity={on(t, t0 + B.observed, t0 + B.observed + 0.4)} />
            <Value x={310} y={Y.verdict} text={h.verdict} size={30} hue={verdictHue} align="center" opacity={on(t, t0 + B.verdict, t0 + B.verdict + 0.4)} />
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
