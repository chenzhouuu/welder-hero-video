import React from 'react';
import {Value} from '../../components/marks';
import {Photo} from '../../components/Photo';
import {tokens} from '../../styles/tokens';
import {track, on, off, lin} from '../../lib/track';
import {LOOP_WELDS} from '../../data/story';
import {HISTORY} from '../../data/history';
import {T} from '../layout';

const L = T.loop.t0;
const SPEED = 600; // px per story second on the fast lane
const Y_FAST = 440;
const Y_SLOW = 780;
const QC = {x0: 700, x1: 1000};
const RS = {x0: 1160, x1: 1560};
const ENTER_DT = 0.62;
const DIVERT = 2; // Weld 090
const DWELL = 1.6; // seconds the diverted weld spends in reasoning while the fast lane keeps moving

/**
 * Chapter 9: the system at scale. Eight new welds stream through the fast check; one
 * disagrees, drops into the reasoning lane and dwells there while the fast lane keeps
 * flowing; all leave with a verdict. Two phrases, then the name.
 */
export const LoopPart: React.FC<{t: number}> = ({t}) => {
  const s = t - L;
  const sceneOn = off(s, 6.0, 6.7);
  const titleOn = on(s, 6.4, 7.1);
  const sweepX = QC.x0 + ((s * 2.2) % 1) * (QC.x1 - QC.x0);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: sceneOn}}>
        <line x1={60} x2={1860} y1={Y_FAST} y2={Y_FAST} stroke={tokens.hairline} strokeWidth={1} />
        <rect x={QC.x0} y={Y_FAST - 64} width={QC.x1 - QC.x0} height={128} fill={tokens.fast} fillOpacity={0.12} />
        <line x1={sweepX} x2={sweepX} y1={Y_FAST - 64} y2={Y_FAST + 64} stroke={tokens.fast} strokeWidth={2} opacity={0.8} />
        <g opacity={on(s, 1.8, 2.3)}>
          <path d={`M${QC.x1 + 40},${Y_FAST} C${QC.x1 + 160},${Y_FAST} ${RS.x0 - 160},${Y_SLOW} ${RS.x0 - 40},${Y_SLOW}`} fill="none" stroke={tokens.hairline} strokeWidth={1} />
          <line x1={RS.x0 - 40} x2={1860} y1={Y_SLOW} y2={Y_SLOW} stroke={tokens.hairline} strokeWidth={1} />
          <rect x={RS.x0} y={Y_SLOW - 64} width={RS.x1 - RS.x0} height={128} fill={tokens.slow} fillOpacity={0.12} />
        </g>
      </svg>
      <Value x={QC.x0} y={Y_FAST - 112} text="fast quality check" size={24} hue={tokens.fast} opacity={sceneOn * on(s, 0.2, 0.6)} />
      <Value x={QC.x0} y={Y_FAST - 156} text="fast screening for all welds" size={34} opacity={sceneOn * on(s, 1.4, 1.9)} />
      <Value x={RS.x0} y={Y_SLOW + 84} text="neural-symbolic reasoning" size={24} hue={tokens.slow} opacity={sceneOn * on(s, 2.2, 2.6)} />
      <Value x={RS.x0} y={Y_SLOW + 122} text="deep reasoning only when needed" size={34} opacity={sceneOn * on(s, 3.4, 3.9)} />
      {LOOP_WELDS.map((id, i) => {
        const e = 0.3 + i * ENTER_DT;
        if (s < e) return null;
        const divert = i === DIVERT;
        // the diverted weld follows the fast lane to the check, drops into the slow lane, dwells, then leaves
        let x = -240 + (s - e) * SPEED;
        let y = Y_FAST;
        if (divert) {
          const tAtQc = e + (QC.x1 + 40 + 240) / SPEED;
          const dropDur = (RS.x0 - 40 - (QC.x1 + 40)) / SPEED;
          const tAtRs = tAtQc + dropDur;
          if (s > tAtQc) {
            const k = lin(s, tAtQc, tAtRs);
            x = QC.x1 + 40 + (RS.x0 - 40 - (QC.x1 + 40)) * k;
            y = Y_FAST + (Y_SLOW - Y_FAST) * track(k, [[0, 0], [1, 1]]);
          }
          if (s > tAtRs) {
            const inside = Math.min(s - tAtRs, DWELL) / DWELL;
            x = RS.x0 - 40 + (RS.x1 - 200 - (RS.x0 - 40)) * inside + Math.max(0, s - tAtRs - DWELL) * SPEED;
            y = Y_SLOW;
          }
        }
        const passed = x > QC.x1 + 10;
        const reasoned = divert && x > RS.x1 - 60;
        const mark = divert ? (reasoned ? '✓' : passed ? '?' : '') : passed ? '✓' : '';
        const markHue = divert ? (reasoned ? tokens.slow : tokens.ink) : tokens.fast;
        const spec = HISTORY[(i * 3 + 1) % HISTORY.length];
        return (
          <div key={id} style={{position: 'absolute', left: x, top: y - 28, height: 56, display: 'flex', alignItems: 'center', gap: 12, opacity: sceneOn}}>
            <div style={{border: `2px solid ${divert && passed ? tokens.slow : tokens.ink}`, padding: '0 14px 0 0', height: 56, display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, fontWeight: 500, background: tokens.bg, fontVariantNumeric: 'tabular-nums'}}>
              <div style={{position: 'relative', width: 96, height: 52, overflow: 'hidden', background: '#111'}}>
                <Photo src={spec.src} natural={spec.natural} width={96} height={52} view={spec.view} />
              </div>
              {id}
            </div>
            <div style={{fontSize: 32, fontWeight: 600, color: markHue, width: 36, opacity: mark ? 1 : 0}}>{mark}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: titleOn}}>
        <div style={{fontSize: 140, fontWeight: 600, letterSpacing: -4, lineHeight: 1, color: tokens.ink}}>WELDER</div>
        <div style={{fontSize: 36, fontWeight: 400, color: tokens.inkSoft, marginTop: 26, letterSpacing: -0.3}}>Neural-Symbolic AI for Smart Manufacturing</div>
      </div>
    </>
  );
};
