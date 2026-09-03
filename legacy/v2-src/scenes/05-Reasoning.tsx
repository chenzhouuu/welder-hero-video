import React from 'react';
import type {SceneProps} from '../lib/scene';
import {SplitStage, CURRENT_LANE, PLATEAU_T, undercutChipPos} from '../components/SplitStage';
import {Band, Link, Stamp, Value, type LinkState} from '../components/marks';
import {laneScales} from '../components/TraceLane';
import {GOOD_WINDOW_A, PLATEAU} from '../data/hero';
import {SPLIT, VIEW_BEAD_SPLIT} from '../lib/layout';
import {bow, partialQuad, type Pt} from '../lib/geom';
import {rise, window01} from '../lib/ease';
import {tokens} from '../styles/tokens';

/**
 * The four candidate causes for undercut in kb-v1 that the slow layer checks against this
 * weld, in the order they are tested. Names are kb-v1 entities, shortened to two words.
 */
const CAUSES = [
  {id: 'H1', name: 'arc instability', x: 330, t: [0.05, 0.27]},
  {id: 'H2', name: 'welding current', x: 800, t: [0.27, 0.55]},
  {id: 'H3', name: 'travel speed', x: 1270, t: [0.55, 0.72]},
  {id: 'H4', name: 'gun angle', x: 1650, t: [0.72, 0.88]},
] as const;
const WORD_Y = SPLIT.band.y + SPLIT.band.h / 2 - 18;

/**
 * Scene 5 — the slow layer reasons on the data. Cause words appear one at a time; each sends
 * a line to its evidence; the check is written as the substituted value; the line's state is
 * the verdict. Nothing is a card; the knowledge graph never appears as a graph.
 */
export const Reasoning: React.FC<SceneProps> = ({progress: p}) => {
  const {x: xt, y: yt} = laneScales(CURRENT_LANE);
  const plateau: Pt = {x: xt((PLATEAU_T[0] + PLATEAU_T[1]) / 2), y: yt(PLATEAU.current_A) - 14};
  const chip = undercutChipPos(VIEW_BEAD_SPLIT, 440);
  const groove: Pt = {x: chip.bottomX + 120, y: chip.bottomY + 6};
  const rank = rise(p, 0.88, 1);

  // H1 — arc instability: predicted fluctuation; plateau CV 0.039 → refuted
  const h1On = rise(p, 0.05, 0.09) * (1 - 0.65 * rise(p, 0.22, 0.27)) * (1 - rank);
  const h1Draw = rise(p, 0.1, 0.18);
  const h1State: LinkState = p < 0.22 ? 'pending' : 'refuted';
  const h1a: Pt = {x: CAUSES[0].x, y: WORD_Y + 52};
  const h1c = bow(h1a, plateau, -0.1);
  const cvOn = window01(p, 0.17, 0.21, 0.88, 0.95);

  // H2 — welding current: 279 A against the qualified window → supported
  const h2On = rise(p, 0.27, 0.31);
  const windowOn = rise(p, 0.32, 0.38);
  const h2Draw = rise(p, 0.38, 0.46);
  const h2State: LinkState = p < 0.5 ? 'pending' : 'supported';
  const h2a: Pt = {x: CAUSES[1].x, y: WORD_Y + 52};
  const h2c = bow(h2a, plateau, 0.08);
  const checkOn = rise(p, 0.48, 0.54);

  // H3 — travel speed: no travel-speed channel in the log → unverified
  const h3On = rise(p, 0.55, 0.59) * (1 - 0.45 * rank);
  const h3Draw = rise(p, 0.6, 0.66);
  const h3a: Pt = {x: CAUSES[2].x, y: WORD_Y + 52};
  const h3b: Pt = {x: CAUSES[2].x, y: SPLIT.trace.y - 54};
  const noSensorOn = rise(p, 0.66, 0.7);

  // H4 — gun angle: one-sided lower-toe groove is consistent; no angle sensor → unverified
  const h4On = rise(p, 0.72, 0.76) * (1 - 0.45 * rank);
  const h4Draw = rise(p, 0.77, 0.84);
  const h4a: Pt = {x: CAUSES[3].x, y: WORD_Y - 14};
  const h4c = bow(h4a, groove, 0.1);

  const wy0 = yt(GOOD_WINDOW_A[1]);
  const wy1 = yt(GOOD_WINDOW_A[0]);
  const words = [h1On, h2On, h3On, h4On];
  return (
    <>
      <SplitStage
        photoH={440}
        view={VIEW_BEAD_SPLIT}
        traceDy={0}
        traceChildren={
          <>
            <Band x0={CURRENT_LANE.x} x1={CURRENT_LANE.x + CURRENT_LANE.w} y0={wy0} y1={wy1} hue={tokens.slow} alpha={0.16} opacity={windowOn} />
            <line x1={CURRENT_LANE.x} x2={CURRENT_LANE.x + CURRENT_LANE.w} y1={wy0} y2={wy0} stroke={tokens.slow} strokeWidth={1.5} opacity={windowOn * 0.8} />
            <line x1={CURRENT_LANE.x} x2={CURRENT_LANE.x + CURRENT_LANE.w} y1={wy1} y2={wy1} stroke={tokens.slow} strokeWidth={1.5} opacity={windowOn * 0.8} />
            <Link d={partialQuad(h1a, h1c, plateau, h1Draw)} hue={tokens.slow} state={h1State} opacity={h1On} />
            <Link d={partialQuad(h2a, h2c, plateau, h2Draw)} hue={tokens.slow} state={h2State} opacity={h2On} />
            <Link d={partialQuad(h3a, {x: h3a.x, y: (h3a.y + h3b.y) / 2}, h3b, h3Draw)} hue={tokens.slow} state="unverified" opacity={h3On} />
            <Link d={partialQuad(h4a, h4c, groove, h4Draw)} hue={tokens.slow} state="unverified" opacity={h4On} />
          </>
        }
      >
        <Value x={CURRENT_LANE.x + CURRENT_LANE.w - 12} y={wy0 - 40} text={`${GOOD_WINDOW_A[0]}–${GOOD_WINDOW_A[1]} A`} size={28} hue={tokens.slow} align="right" opacity={windowOn} />
        <Value x={plateau.x - 70} y={plateau.y - 64} text={`CV ${PLATEAU.current_cv.toFixed(3)}`} size={28} hue={tokens.inkSoft} align="right" opacity={cvOn} />
        <Value x={plateau.x + 44} y={plateau.y - 64} text={`${PLATEAU.current_A.toFixed(0)} A ∉ [${GOOD_WINDOW_A[0]}, ${GOOD_WINDOW_A[1]}] A`} size={32} hue={tokens.slow} opacity={checkOn} />
        <Value x={CAUSES[2].x} y={h3b.y + 10} text="no travel sensor" size={28} hue={tokens.inkSoft} align="center" opacity={noSensorOn} />
      </SplitStage>
      {CAUSES.map((c, i) => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: c.x,
            top: WORD_Y,
            transform: `translateX(-50%) scale(${i === 1 ? 1 + 0.18 * rank : 1})`,
            transformOrigin: '50% 50%',
            fontSize: 34,
            fontWeight: i === 1 && p >= 0.5 ? 600 : 500,
            color: i === 0 && p >= 0.22 ? tokens.inkSoft : tokens.slow,
            opacity: words[i],
            whiteSpace: 'nowrap',
            letterSpacing: -0.3,
          }}
        >
          {c.name}
        </div>
      ))}
      <Stamp text="slow layer" hue={tokens.slow} opacity={rise(p, 0.02, 0.08)} />
    </>
  );
};
