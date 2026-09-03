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
 * photo to the steady plateau on the trace; the word appears on it. The turning point.
 */
export const DisagreePart: React.FC<{t: number; groove: Pt; lane: Lane; photoH: number}> = ({t, groove, lane, photoH}) => {
  const {x: xt, y: yt} = laneScales(lane);
  const plateau: Pt = {x: xt(18.5), y: yt(PLATEAU.current_A) - 16};
  const p1 = bow(groove, plateau, -0.1);
  const draw = lin(t, D + 3.0, D + 4.4);
  const wordOn = on(t, D + 4.5, D + 5.0) * off(t, T.reason.t0 + 0.2, T.reason.t0 + 1.0);
  const subOn = on(t, D + 6.0, D + 6.6) * off(t, T.reason.t0 + 0.2, T.reason.t0 + 1.0);
  const lineOn = off(t, T.reason.t0 + 0.2, T.reason.t0 + 1.0);
  const mid = quadAt(groove, p1, plateau, 0.5);
  const bandY = photoH + (lane.y - photoH) / 2;
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <Link d={partialQuad(groove, p1, plateau, draw)} hue={tokens.ink} state="pending" width={3} opacity={lineOn} />
      </svg>
      <Value x={mid.x + 40} y={Math.min(mid.y, bandY) - 26} text="disagreement" size={44} opacity={wordOn} />
      <Value x={mid.x + 40} y={Math.min(mid.y, bandY) + 34} text="product abnormal · process nominal" size={28} hue={tokens.inkSoft} opacity={subOn} />
    </>
  );
};
