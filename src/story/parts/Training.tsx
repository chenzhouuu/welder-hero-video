import React from 'react';
import {Photo} from '../../components/Photo';
import {TorchSchematic} from '../../components/TorchSchematic';
import {Region, Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {track, on, off} from '../../lib/track';
import {PHOTO_FRONT, PHOTO_FRONT_SIZE} from '../../data/hero';
import {GOOD_PHOTO, GOOD_PHOTO_SIZE} from '../../data/good';
import {undercutPath} from '../../data/marks';
import {T} from '../layout';

const S = T.training.t0;
const CROP_W = 840;
const CROP_H = 250;
const VIEW_DEFECT = {x: 600, y: 225, w: 780, h: 232};
const VIEW_TARGET = {x: 640, y: 215, w: 780, h: 232};

/**
 * Chapter 8: the recurring mechanism becomes coaching. Left, the schematic morphs from the
 * observed practice to the recommended one; right, the defect weld and the target weld
 * (real photos). One message.
 */
export const TrainingPart: React.FC<{t: number}> = ({t}) => {
  const k = track(t, [[S + 2.5, 0], [S + 4.5, 1]]);
  const schemOn = on(t, S + 0.2, S + 0.8);
  const obsOn = on(t, S + 0.4, S + 0.8) * off(t, S + 2.4, S + 2.9);
  const recOn = on(t, S + 3.6, S + 4.1);
  const defectOn = on(t, S + 0.6, S + 1.1);
  const arrowOn = on(t, S + 3.0, S + 3.5);
  const wipe = track(t, [[S + 3.4, 0], [S + 4.8, 1]]);
  const msgOn = on(t, S + 5.4, S + 6.0);
  const msg2On = on(t, S + 6.0, S + 6.6);
  const rx = 1000;
  return (
    <>
      <div style={{position: 'absolute', left: 30, top: 200, width: 900, height: 640, opacity: schemOn, transform: 'scale(1.18)', transformOrigin: '0 0'}}>
        <TorchSchematic k={k} />
      </div>
      <Value x={120} y={140} text="observed practice" size={30} hue={tokens.fast} opacity={obsOn} />
      <Value x={120} y={140} text="recommended practice" size={30} hue={tokens.slow} opacity={recOn} />
      <Value x={120} y={186} text="work angle · travel" size={24} hue={tokens.inkSoft} opacity={schemOn} />
      {/* defect weld → target weld */}
      <Value x={rx} y={140} text="defect weld" size={24} hue={tokens.inkSoft} opacity={defectOn} />
      <div style={{position: 'absolute', left: rx, top: 186, width: CROP_W, height: CROP_H, opacity: defectOn, background: '#111'}}>
        <Photo src={PHOTO_FRONT} natural={PHOTO_FRONT_SIZE} width={CROP_W} height={CROP_H} view={VIEW_DEFECT}>
          <Region d={undercutPath()} hue={tokens.fast} strokeWidth={1.5} />
        </Photo>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M${rx + CROP_W / 2},470 v54 m-14,-16 l14,16 l14,-16`} fill="none" stroke={tokens.slow} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={arrowOn} />
      </svg>
      <Value x={rx} y={548} text="target weld" size={24} hue={tokens.inkSoft} opacity={arrowOn} />
      <div style={{position: 'absolute', left: rx, top: 594, width: CROP_W, height: CROP_H, background: '#111', clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`, opacity: on(t, S + 3.4, S + 3.5)}}>
        <Photo src={GOOD_PHOTO} natural={GOOD_PHOTO_SIZE} width={CROP_W} height={CROP_H} view={VIEW_TARGET} />
      </div>
      <Value x={960} y={920} text="targeted welder training" size={42} align="center" opacity={msgOn} />
      <Value x={960} y={976} text="work-angle / travel consistency" size={30} hue={tokens.slow} align="center" opacity={msg2On} />
    </>
  );
};
