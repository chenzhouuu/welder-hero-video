import React from 'react';
import type {SceneProps} from '../lib/scene';
import {SplitStage, CURRENT_LANE, PLATEAU_T, undercutChipPos} from '../components/SplitStage';
import {Link, Stamp, Value} from '../components/marks';
import {laneScales} from '../components/TraceLane';
import {VIEW_BEAD, VIEW_BEAD_SPLIT, lerpView} from '../lib/layout';
import {bow, partialQuad, quadAt} from '../lib/geom';
import {easeInOutCubic, fall, rise, seg, lerp} from '../lib/ease';
import {tokens} from '../styles/tokens';

/**
 * Scene 4 — two findings that do not add up. The photo shrinks to the top, the current trace
 * rises from below; a line joins the defect to the steady plateau and carries one word.
 */
export const Disagreement: React.FC<SceneProps> = ({progress: p}) => {
  const k = easeInOutCubic(seg(p, 0.0, 0.3));
  const photoH = lerp(1080, 440, k);
  const view = lerpView(VIEW_BEAD, VIEW_BEAD_SPLIT, k);
  const traceDy = lerp(560, 0, k);
  const chip = undercutChipPos(view, photoH);
  const {x: xt, y: yt} = laneScales(CURRENT_LANE);
  const p0 = {x: chip.bottomX, y: chip.bottomY + 6};
  const p2 = {x: xt((PLATEAU_T[0] + PLATEAU_T[1]) / 2), y: yt(279) - 16};
  const p1 = bow(p0, p2, -0.12);
  const draw = rise(p, 0.42, 0.6);
  const word = quadAt(p0, p1, p2, 0.5);
  const wordOn = rise(p, 0.6, 0.68);
  return (
    <>
      <SplitStage photoH={photoH} view={view} traceDy={traceDy} traceChildren={traceDy < 1 ? <Link d={partialQuad(p0, p1, p2, draw)} hue={tokens.ink} state="pending" width={3} /> : null}>
        <Value x={word.x + 22} y={word.y - 18} text="unexplained" size={32} opacity={wordOn} />
      </SplitStage>
      <Stamp text="fast layer" hue={tokens.fast} opacity={fall(p, 0.86, 0.96)} />
    </>
  );
};
