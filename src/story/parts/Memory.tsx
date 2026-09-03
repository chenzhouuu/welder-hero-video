import React from 'react';
import {WeldThumb} from '../../components/WeldThumb';
import {Region, Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {track, on, off} from '../../lib/track';
import {HISTORY, HERO_INDEX} from '../../data/history';
import {undercutPath} from '../../data/marks';
import {LABELS} from '../../data/story';
import {T, HERO_THUMB} from '../layout';

const M = T.memory.t0;
const ROW_Y = HERO_THUMB.y;
const W = HERO_THUMB.w;
const H = HERO_THUMB.h;
const rowX = (i: number): number => 150 + i * 330;
const GROUP_SCALE = 1.25;
const GW = W * GROUP_SCALE;
const GH = H * GROUP_SCALE;
const GROUP_X = [960 - GW * 1.5 - 40, 960 - GW / 2, 960 + GW / 2 + 40];
const GROUP_Y = 120;

/**
 * Chapter 7: the diagnosed weld joins the operator's earlier welds as a thumbnail row (real
 * photos). The undercut welds lift out and gather; the mechanism marks they carry converge
 * into one word pair: a recurring pattern.
 */
export const MemoryPart: React.FC<{t: number}> = ({t}) => {
  if (t < M + 1.5) return null;
  const lift = track(t, [[M + 3.8, 0], [M + 5.6, 1]]);
  const marksOn = on(t, M + 5.6, M + 6.2);
  const converge = track(t, [[M + 6.6, 0], [M + 7.6, 1]]);
  const patternOn = on(t, M + 7.4, M + 8.0);
  let uc = 0;
  return (
    <>
      <Value x={rowX(0)} y={ROW_Y - 62} text={LABELS.operator} size={28} opacity={on(t, M + 2.0, M + 2.5) * (1 - 0.5 * lift)} />
      <Value x={rowX(0) + 250} y={ROW_Y - 58} text="earlier welds, same station" size={24} hue={tokens.inkSoft} opacity={on(t, M + 2.2, M + 2.7) * (1 - 0.5 * lift)} />
      {HISTORY.map((spec, i) => {
        const isHero = i === HERO_INDEX;
        const isUc = spec.status === 'undercut';
        const gi = isUc ? uc++ : -1;
        const x0 = rowX(i);
        const x = isUc ? x0 + (GROUP_X[gi] - x0) * lift : x0;
        const y = isUc ? ROW_Y + (GROUP_Y - ROW_Y) * lift : ROW_Y;
        const tw = isUc ? W + (GW - W) * lift : W;
        const th = isUc ? H + (GH - H) * lift : H;
        const fade = isHero ? 1 : on(t, M + 1.6 + i * 0.25, M + 2.0 + i * 0.25);
        const dim = isUc ? 1 : 1 - 0.6 * lift;
        // the mechanism mark starts under its thumbnail and converges to the pattern
        const mx0 = x + 14;
        const my0 = y + th - 40;
        const mx = mx0 + (960 - 70 - mx0) * converge;
        const my = my0 + (GROUP_Y + GH + 70 - my0) * converge;
        return (
          <React.Fragment key={spec.id}>
            <WeldThumb spec={spec} x={x} y={y} w={tw} h={th} opacity={fade * dim} labelOn={isHero ? on(t, M + 1.5, M + 1.6) : 1}>
              {isHero ? (
                <svg width={tw} height={th} viewBox={`${spec.view.x} ${spec.view.y} ${spec.view.w} ${spec.view.h}`} style={{position: 'absolute', left: 0, top: 0}}>
                  <Region d={undercutPath()} hue={tokens.fast} strokeWidth={4} />
                </svg>
              ) : null}
            </WeldThumb>
            {isUc ? (
              <div style={{position: 'absolute', left: mx, top: my, background: tokens.slow, color: '#fff', fontSize: 22, fontWeight: 500, lineHeight: 1, padding: '7px 10px', opacity: marksOn * (1 - on(t, M + 7.2, M + 7.45)), whiteSpace: 'nowrap'}}>
                torch / travel
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <Value x={960} y={GROUP_Y + GH + 66} text="recurring pattern" size={38} align="center" opacity={patternOn} />
      <Value x={960} y={GROUP_Y + GH + 118} text="torch / travel behaviour" size={30} hue={tokens.slow} align="center" opacity={on(t, M + 7.8, M + 8.4)} />
      <Value x={960} y={GROUP_Y + GH + 162} text="3 of 5 welds · same lower-toe groove" size={24} hue={tokens.inkSoft} align="center" opacity={on(t, M + 8.2, M + 8.8) * off(t, T.training.t0 - 0.01, T.training.t0)} />
    </>
  );
};
