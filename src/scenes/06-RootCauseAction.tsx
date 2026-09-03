import React from 'react';
import type {SceneProps} from '../lib/scene';
import {SplitStage, CURRENT_LANE, PLATEAU_T} from '../components/SplitStage';
import {Photo} from '../components/Photo';
import {Band, Link, Stamp, Value} from '../components/marks';
import {TraceLane, laneScales} from '../components/TraceLane';
import {GOOD_WINDOW_A, PLATEAU} from '../data/hero';
import {good, GOOD_PHOTO, GOOD_PHOTO_SIZE, GOOD_PLATEAU_A, GOOD_NOMINAL_A_HERO} from '../data/good';
import {SPLIT, VIEW_BEAD_SPLIT, VIEW_GOOD_BEAD_SPLIT} from '../lib/layout';
import {bow, partialQuad, type Pt} from '../lib/geom';
import {easeInOutCubic, rise, seg} from '../lib/ease';
import {tokens} from '../styles/tokens';

const WORD_X = 800;
const WORD_Y = SPLIT.band.y + SPLIT.band.h / 2 - 18;

/**
 * Scene 6 — the supported cause becomes a correction, and the correction is shown working.
 * The qualified window becomes the target on the trace; the setpoint is struck through; a
 * real good weld's trace writes itself inside the window while its photo wipes in.
 */
export const RootCauseAction: React.FC<SceneProps> = ({progress: p}) => {
  const {x: xt, y: yt} = laneScales(CURRENT_LANE);
  const plateau: Pt = {x: xt((PLATEAU_T[0] + PLATEAU_T[1]) / 2), y: yt(PLATEAU.current_A) - 14};
  const wy0 = yt(GOOD_WINDOW_A[1]);
  const wy1 = yt(GOOD_WINDOW_A[0]);
  const wordA: Pt = {x: WORD_X, y: WORD_Y + 52};
  const wordC = bow(wordA, plateau, 0.08);

  const target = rise(p, 0.12, 0.26); // window becomes the target
  const wordOut = rise(p, 0.24, 0.32);
  const barOn = rise(p, 0.3, 0.38);
  const strike = rise(p, 0.38, 0.44);
  const newOn = rise(p, 0.44, 0.5);
  const tGood = CURRENT_LANE.tRange[0] + (CURRENT_LANE.tRange[1] - CURRENT_LANE.tRange[0]) * easeInOutCubic(seg(p, 0.42, 0.9));
  const wipe = easeInOutCubic(seg(p, 0.58, 0.74));
  const fastMarks = 1 - rise(p, 0.6, 0.72);
  const goodValueOn = rise(p, 0.9, 0.96);
  const tGoodHead = Math.min(tGood, good.t[good.arc_on_rows[1]]);
  // diagonal wipe: reveal the good photo from the top-right corner
  const d = wipe * (1920 + 440) * 1.15;
  const clip = `polygon(${1920 - d}px 0px, 1920px 0px, 1920px 440px, ${1920 - d + 440}px 440px)`;

  return (
    <>
      <SplitStage
        photoH={440}
        view={VIEW_BEAD_SPLIT}
        traceDy={0}
        fastMarks={fastMarks}
        traceOpacity={1 - 0.62 * rise(p, 0.55, 0.75)}
        traceChildren={
          <>
            <Band x0={CURRENT_LANE.x} x1={CURRENT_LANE.x + CURRENT_LANE.w} y0={wy0} y1={wy1} hue={tokens.slow} alpha={0.16 + 0.08 * target} />
            <line x1={CURRENT_LANE.x} x2={CURRENT_LANE.x + CURRENT_LANE.w} y1={wy0} y2={wy0} stroke={tokens.slow} strokeWidth={1.5 + 2 * target} />
            <line x1={CURRENT_LANE.x} x2={CURRENT_LANE.x + CURRENT_LANE.w} y1={wy1} y2={wy1} stroke={tokens.slow} strokeWidth={1.5 + 2 * target} />
            <Link d={partialQuad(wordA, wordC, plateau, 1)} hue={tokens.slow} state="supported" opacity={1 - wordOut} />
            <TraceLane lane={CURRENT_LANE} t={good.t} v={good.current_A} tEnd={tGoodHead} baseline={false} head={p < 0.9} />
          </>
        }
      >
        <Value x={CURRENT_LANE.x + CURRENT_LANE.w - 12} y={wy0 - 40} text={`${GOOD_WINDOW_A[0]}–${GOOD_WINDOW_A[1]} A`} size={28} hue={tokens.slow} align="right" />
        <Value x={plateau.x + 44} y={plateau.y - 64} text={`${PLATEAU.current_A.toFixed(0)} A ∉ [${GOOD_WINDOW_A[0]}, ${GOOD_WINDOW_A[1]}] A`} size={32} hue={tokens.slow} opacity={1 - wordOut} />
        <Value x={xt(good.t[good.arc_on_rows[1]]) + 16} y={yt(GOOD_PLATEAU_A) - 16} text={`${GOOD_PLATEAU_A.toFixed(0)} A`} size={32} opacity={goodValueOn} />
      </SplitStage>
      {/* the good weld's photo wipes in over the undercut photo */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 440, clipPath: clip}}>
        <Photo src={GOOD_PHOTO} natural={GOOD_PHOTO_SIZE} width={1920} height={440} view={VIEW_GOOD_BEAD_SPLIT} />
      </div>
      {/* the cause word becomes the recommendation */}
      <div style={{position: 'absolute', left: WORD_X, top: WORD_Y, transform: 'translateX(-50%) scale(1.18)', transformOrigin: '50% 50%', fontSize: 34, fontWeight: 600, color: tokens.slow, opacity: 1 - wordOut, whiteSpace: 'nowrap'}}>
        welding current
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: WORD_Y - 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, opacity: barOn}}>
        <div style={{background: tokens.slow, color: '#fff', fontSize: 40, fontWeight: 500, padding: '12px 22px', lineHeight: 1, letterSpacing: -0.3}}>reduce welding current</div>
        <div style={{position: 'relative', fontSize: 40, fontWeight: 500, color: tokens.inkSoft, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
          {`${GOOD_NOMINAL_A_HERO} A`}
          <div style={{position: 'absolute', left: -4, right: -4, top: '50%', height: 3, background: tokens.ink, transform: `scaleX(${strike})`, transformOrigin: '0 50%'}} />
        </div>
        <div style={{fontSize: 40, fontWeight: 500, color: tokens.slow, lineHeight: 1, fontVariantNumeric: 'tabular-nums', opacity: newOn}}>{`${GOOD_WINDOW_A[0]}–${GOOD_WINDOW_A[1]} A`}</div>
      </div>
      <Stamp text="slow layer" hue={tokens.slow} />
    </>
  );
};
