import React from 'react';
import {Photo} from '../../components/Photo';
import {TorchSchematic} from '../../components/TorchSchematic';
import {Region, Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {track, on} from '../../lib/track';
import {PHOTO_FRONT, PHOTO_FRONT_SIZE} from '../../data/hero';
import {GOOD_PHOTO, GOOD_PHOTO_SIZE} from '../../data/good';
import {undercutPath} from '../../data/marks';
import {T} from '../layout';

const S = T.training.t0;
const CROP_W = 760;
const CROP_H = 226;
const VIEW_DEFECT = {x: 600, y: 225, w: 780, h: 232};
const VIEW_TARGET = {x: 640, y: 215, w: 780, h: 232};
const SCH = 0.5; // schematic scale (900×640 → 450×320)

/**
 * Chapter 8: from the recurring pattern to coaching. The pattern words (kept from chapter 7)
 * become the training focus; then, side by side, observed vs recommended practice
 * (qualitative schematic) and defect weld vs target weld (real photos). One message.
 */
export const TrainingPart: React.FC<{t: number}> = ({t}) => {
  const obsOn = on(t, S + 2.6, S + 3.2);
  const recOn = on(t, S + 4.2, S + 4.8);
  const defectOn = on(t, S + 3.2, S + 3.8);
  const wipe = track(t, [[S + 4.8, 0], [S + 6.2, 1]]);
  const vsOn = on(t, S + 4.0, S + 4.4);
  const msgOn = on(t, S + 7.4, S + 8.0);
  const lx = 100;
  const rx = 1060;
  const rowA = 250;
  const rowB = 700;
  return (
    <>
      {/* left: practice */}
      <Value x={lx} y={rowA - 44} text="observed practice" size={26} hue={tokens.fast} opacity={obsOn} />
      <div style={{position: 'absolute', left: lx, top: rowA, width: 900 * SCH, height: 640 * SCH, opacity: obsOn}}>
        <div style={{transform: `scale(${SCH})`, transformOrigin: '0 0', position: 'absolute', left: 0, top: 0}}>
          <TorchSchematic variant="observed" />
        </div>
      </div>
      <Value x={lx} y={rowB - 44} text="recommended practice" size={26} hue={tokens.slow} opacity={recOn} />
      <div style={{position: 'absolute', left: lx, top: rowB, width: 900 * SCH, height: 640 * SCH, opacity: recOn}}>
        <div style={{transform: `scale(${SCH})`, transformOrigin: '0 0', position: 'absolute', left: 0, top: 0}}>
          <TorchSchematic variant="recommended" />
        </div>
      </div>
      <Value x={lx + (900 * SCH) / 2} y={rowA + 640 * SCH + 22} text="versus" size={24} hue={tokens.inkSoft} align="center" opacity={vsOn} />
      {/* right: weld */}
      <Value x={rx} y={rowA - 44} text="defect weld" size={26} hue={tokens.fast} opacity={defectOn} />
      <div style={{position: 'absolute', left: rx, top: rowA, width: CROP_W, height: CROP_H, opacity: defectOn, background: '#111'}}>
        <Photo src={PHOTO_FRONT} natural={PHOTO_FRONT_SIZE} width={CROP_W} height={CROP_H} view={VIEW_DEFECT}>
          <Region d={undercutPath()} hue={tokens.fast} strokeWidth={1.5} />
        </Photo>
      </div>
      <Value x={rx + CROP_W / 2} y={rowA + CROP_H + 22 + 40} text="versus" size={24} hue={tokens.inkSoft} align="center" opacity={vsOn} />
      <Value x={rx} y={rowB - 44} text="target weld" size={26} hue={tokens.slow} opacity={on(t, S + 4.8, S + 5.2)} />
      <div style={{position: 'absolute', left: rx, top: rowB, width: CROP_W, height: CROP_H, background: '#111', clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`, opacity: on(t, S + 4.8, S + 4.9)}}>
        <Photo src={GOOD_PHOTO} natural={GOOD_PHOTO_SIZE} width={CROP_W} height={CROP_H} view={VIEW_TARGET} />
      </div>
      <Value x={1920 - 100} y={110} text="targeted welder training" size={36} align="right" opacity={msgOn} />
      <Value x={1920 - 100} y={156} text="inspection becomes feedback" size={26} hue={tokens.inkSoft} align="right" opacity={on(t, S + 8.0, S + 8.6)} />
    </>
  );
};
