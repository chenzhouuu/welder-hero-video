import React from 'react';
import {WeldThumb} from '../../components/WeldThumb';
import {Region, Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {track, on, off} from '../../lib/track';
import {HISTORY, HERO_INDEX} from '../../data/history';
import {undercutPath} from '../../data/marks';
import {LABELS} from '../../data/story';
import {T, GRID, gridSlot} from '../layout';

const M = T.memory.t0;
const S = T.training.t0;
/** The undercut welds lift into a row of their own, slightly larger; the good welds sink and dim. */
const LIFT_SCALE = 1.1;
const LW = GRID.w * LIFT_SCALE;
const LH = GRID.h * LIFT_SCALE;
const LIFT_Y = 150;
const SINK_Y = 660;
const N_UC = HISTORY.filter((h) => h.status === 'undercut').length;
const liftX = (k: number): number => (1920 - (N_UC * LW + (N_UC - 1) * 30)) / 2 + k * (LW + 30);
const PATTERN_Y = LIFT_Y + LH + 96;

/** Where the recurring-pattern words sit in chapter 7 and where they go at the start of chapter 8. */
export const PATTERN_POS = {x: 960, y: PATTERN_Y};
export const FOCUS_POS = {x: 100, y: 110};

/**
 * Chapter 7: the diagnosed weld becomes one record in the operator's history — real photos
 * of eight welds, the hero among them. The undercut cases lift out of the grid, the good
 * ones stay; each undercut case shows the mechanism it was diagnosed with; the marks
 * converge: a recurring pattern. Chapter 8 keeps the words and lets the photos go.
 */
export const MemoryPart: React.FC<{t: number}> = ({t}) => {
  if (t < M + 1.5) return null;
  const lift = track(t, [[M + 4.4, 0], [M + 6.0, 1]]);
  const marksOn = on(t, M + 6.2, M + 6.7);
  const converge = track(t, [[M + 7.4, 0], [M + 8.4, 1]]);
  const patternOn = on(t, M + 8.3, M + 8.9);
  const photosOff = off(t, S + 0.2, S + 1.4);
  // chapter 8 opening: the pattern words travel to the top-left and become the training focus
  const toFocus = track(t, [[S + 1.2, 0], [S + 2.4, 1]]);
  const px = PATTERN_POS.x + (FOCUS_POS.x - PATTERN_POS.x) * toFocus;
  const py = PATTERN_POS.y + (FOCUS_POS.y - PATTERN_POS.y) * toFocus;
  const align = toFocus > 0.999 ? 'left' : 'center';
  let uc = 0;
  return (
    <>
      <Value x={GRID.x0} y={GRID.y0 - 74} text={LABELS.operator} size={30} opacity={on(t, M + 2.0, M + 2.5) * (1 - lift) * photosOff} />
      <Value x={GRID.x0 + 270} y={GRID.y0 - 70} text="recent welds, same station" size={24} hue={tokens.inkSoft} opacity={on(t, M + 2.2, M + 2.7) * (1 - lift) * photosOff} />
      {HISTORY.map((spec, i) => {
        const isHero = i === HERO_INDEX;
        const isUc = spec.status === 'undercut';
        const k = isUc ? uc++ : -1;
        const slot = gridSlot(i);
        const x = isUc ? slot.x + (liftX(k) - slot.x) * lift : slot.x;
        const y = isUc ? slot.y + (LIFT_Y - slot.y) * lift : slot.y + (SINK_Y - slot.y) * lift;
        const w = isUc ? slot.w + (LW - slot.w) * lift : slot.w;
        const h = isUc ? slot.h + (LH - slot.h) * lift : slot.h;
        const fade = isHero ? 1 : on(t, M + 1.6 + i * 0.18, M + 2.0 + i * 0.18);
        const dim = isUc ? 1 : 1 - 0.65 * lift;
        // the mechanism mark starts inside its thumbnail and converges to the pattern
        const mx0 = x + 14;
        const my0 = y + h - 44;
        const mx = mx0 + (960 - 76 - mx0) * converge;
        const my = my0 + (PATTERN_Y - 4 - my0) * converge;
        return (
          <React.Fragment key={spec.id}>
            <WeldThumb spec={spec} x={x} y={y} w={w} h={h} opacity={fade * dim * photosOff} labelOn={isHero ? on(t, M + 1.5, M + 1.6) : 1}>
              {isHero ? (
                <svg width={w} height={h} viewBox={`${spec.view.x} ${spec.view.y} ${spec.view.w} ${spec.view.h}`} style={{position: 'absolute', left: 0, top: 0}}>
                  <Region d={undercutPath()} hue={tokens.fast} strokeWidth={3} />
                </svg>
              ) : null}
            </WeldThumb>
            {isUc ? (
              <div style={{position: 'absolute', left: mx, top: my, background: tokens.slow, color: '#fff', fontSize: 22, fontWeight: 500, lineHeight: 1, padding: '7px 10px', opacity: marksOn * (1 - on(t, M + 8.2, M + 8.45)), whiteSpace: 'nowrap'}}>
                torch / travel
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      {/* the words: recurring pattern → training focus */}
      <Value x={px} y={py} text="recurring pattern" size={38} align={align} opacity={patternOn * (1 - toFocus)} />
      <Value x={px} y={py + 6} text="training focus" size={26} hue={tokens.inkSoft} align={align} opacity={toFocus} />
      <Value x={px} y={py + 52} text="torch / travel behaviour" size={30} hue={tokens.slow} align={align} opacity={on(t, M + 8.7, M + 9.2) * (1 - toFocus)} />
      <Value x={px} y={py + 44} text="torch / travel consistency" size={34} hue={tokens.slow} align={align} opacity={toFocus} />
      <Value x={960} y={PATTERN_Y + 98} text={`${N_UC} of ${HISTORY.length} welds · same lower-toe groove`} size={24} hue={tokens.inkSoft} align="center" opacity={on(t, M + 9.1, M + 9.6) * photosOff} />
    </>
  );
};
