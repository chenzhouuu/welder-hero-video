import React from 'react';
import {Link, Value} from '../../components/marks';
import {laneScales, type Lane} from '../../components/TraceLane';
import {bow, partialQuad, quadAt, type Pt} from '../../lib/geom';
import {tokens} from '../../styles/tokens';
import {lin, on, off} from '../../lib/track';
import {PLATEAU} from '../../data/hero';
import {T} from '../layout';

const D = T.disagree.t0;

/**
 * Chapter 4: the two fast findings are joined. A line runs from the defect region on the
 * photo to the stable plateau on the trace and carries one word. The turning point: the
 * product is defective although the machine-side trajectory is stable.
 */
export const DisagreePart: React.FC<{t: number; groove: Pt; lane: Lane}> = ({t, groove, lane}) => {
  const {x: xt, y: yt} = laneScales(lane);
  const plateau: Pt = {x: xt(18.5), y: yt(PLATEAU.current_A) - 16};
  const p1 = bow(groove, plateau, -0.1);
  const draw = lin(t, D + 2.6, D + 4.0);
  const gone = off(t, T.reason.t0, T.reason.t0 + 0.8);
  const wordOn = on(t, D + 4.1, D + 4.6) * gone;
  const mid = quadAt(groove, p1, plateau, 0.5);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <Link d={partialQuad(groove, p1, plateau, draw)} hue={tokens.ink} state="pending" width={3} opacity={gone} />
      </svg>
      <Value x={mid.x + 36} y={mid.y - 30} text="disagreement" size={46} opacity={wordOn} />
    </>
  );
};
