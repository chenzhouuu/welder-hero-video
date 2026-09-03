import React from 'react';
import {Photo, photoFit, type View} from '../components/Photo';
import {TraceLane, laneScales, type Lane} from '../components/TraceLane';
import {Band, Chip, Region, Value} from '../components/marks';
import {PHOTO_FRONT, PHOTO_FRONT_SIZE, PLATEAU, PLATEAU_ROWS, signals} from '../data/hero';
import {UNDERCUT_BOX, undercutPath} from '../data/marks';
import {SPLIT} from '../lib/layout';
import {tokens} from '../styles/tokens';

export const T_ALL: [number, number] = [0, 40];
export const PLATEAU_T: [number, number] = [signals.t[PLATEAU_ROWS[0]], signals.t[PLATEAU_ROWS[1]]];
export const CURRENT_LANE: Lane = {...SPLIT.trace, tRange: T_ALL, vRange: [0, 340]};

type Props = {
  /** photo box height (1080 = full frame, 440 = split) */
  photoH: number;
  view: View;
  /** vertical offset of the trace block (positive = pushed down, off screen) */
  traceDy: number;
  /** opacity of the fast-layer marks (region, chip, band, value) */
  fastMarks?: number;
  /** extra SVG drawn over the trace, in frame coordinates */
  traceChildren?: React.ReactNode;
  /** extra SVG drawn in photo image coordinates */
  photoChildren?: React.ReactNode;
  /** extra HTML in frame coordinates */
  children?: React.ReactNode;
  photoOpacity?: number;
  /** opacity of the hero trace itself (scene 6 lets it recede behind the next weld) */
  traceOpacity?: number;
};

/** Screen position of the undercut region's top-left for the current framing. */
export const undercutChipPos = (view: View, photoH: number): {x: number; y: number; bottomX: number; bottomY: number} => {
  const fit = photoFit(PHOTO_FRONT_SIZE, view, 1920, photoH);
  return {
    x: fit.tx + UNDERCUT_BOX.x0 * fit.scale,
    y: fit.ty + UNDERCUT_BOX.y0 * fit.scale - 50,
    bottomX: fit.tx + ((UNDERCUT_BOX.x0 + UNDERCUT_BOX.x1) / 2) * fit.scale,
    bottomY: fit.ty + UNDERCUT_BOX.y1 * fit.scale,
  };
};

/**
 * The shared composition of scenes 4–6: the real photo above, the current trace below, the
 * fast layer's marks already on both. Scenes add their own lines and words.
 */
export const SplitStage: React.FC<Props> = ({photoH, view, traceDy, fastMarks = 1, traceChildren, photoChildren, children, photoOpacity = 1, traceOpacity = 1}) => {
  const {x: xt} = laneScales(CURRENT_LANE);
  const bx0 = xt(PLATEAU_T[0]);
  const bx1 = xt(PLATEAU_T[1]);
  const chip = undercutChipPos(view, photoH);
  const fit = photoFit(PHOTO_FRONT_SIZE, view, 1920, photoH);
  return (
    <>
      <Photo src={PHOTO_FRONT} natural={PHOTO_FRONT_SIZE} width={1920} height={photoH} view={view} opacity={photoOpacity}>
        <Region d={undercutPath()} hue={tokens.fast} opacity={fastMarks} strokeWidth={2 / fit.scale} />
        {photoChildren}
      </Photo>
      <Chip x={chip.x} y={chip.y} hue={tokens.fast} text="undercut" opacity={fastMarks} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${traceDy}px)`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <TraceLane lane={CURRENT_LANE} t={signals.t} v={signals.current_A} opacity={traceOpacity} />
          <Band x0={bx0} x1={bx1} y0={CURRENT_LANE.y} y1={CURRENT_LANE.y + CURRENT_LANE.h} hue={tokens.fast} opacity={fastMarks} />
          {traceChildren}
        </svg>
        <Value x={CURRENT_LANE.x + CURRENT_LANE.w + 18} y={CURRENT_LANE.y + CURRENT_LANE.h - 22} text="A" size={28} hue={tokens.inkSoft} />
        <Value x={bx0 + 122} y={CURRENT_LANE.y - 40} text={`${PLATEAU.current_A.toFixed(0)} A`} size={32} opacity={fastMarks} />
        <Chip x={bx0} y={CURRENT_LANE.y - 44} hue={tokens.fast} text="steady" opacity={fastMarks} />
        {children}
      </div>
    </>
  );
};
