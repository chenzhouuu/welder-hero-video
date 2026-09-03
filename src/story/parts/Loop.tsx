import React from 'react';
import {Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {track, on, off, lin} from '../../lib/track';
import {LOOP_WELDS} from '../../data/story';
import {Photo} from '../../components/Photo';
import {HISTORY} from '../../data/history';
import {T} from '../layout';

const L = T.loop.t0;
const SPEED = 520; // px per story second
const Y_FAST = 520;
const Y_SLOW = 800;
const QC = {x0: 760, x1: 1060};
const RS = {x0: 1380, x1: 1720};
const ENTER = [0.3, 1.1, 1.9, 2.7, 3.5];
const DIVERT = 2; // Weld 090

/**
 * Chapter 9: the system at scale. New welds stream through the fast check; one disagrees
 * and drops into the reasoning lane; all leave with a verdict. Two phrases, then the name.
 */
export const LoopPart: React.FC<{t: number}> = ({t}) => {
  const s = t - L;
  const sceneOn = off(s, 5.2, 5.9);
  const titleOn = on(s, 5.6, 6.3);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: sceneOn}}>
        <line x1={80} x2={1840} y1={Y_FAST} y2={Y_FAST} stroke={tokens.hairline} strokeWidth={1} />
        <rect x={QC.x0} y={Y_FAST - 70} width={QC.x1 - QC.x0} height={140} fill={tokens.fast} fillOpacity={0.12} />
        <line x1={QC.x0 + ((s * 1.7) % 1) * (QC.x1 - QC.x0)} x2={QC.x0 + ((s * 1.7) % 1) * (QC.x1 - QC.x0)} y1={Y_FAST - 70} y2={Y_FAST + 70} stroke={tokens.fast} strokeWidth={2} opacity={0.8} />
        <g opacity={on(s, 2.6, 3.0)}>
          <line x1={RS.x0 - 120} x2={1840} y1={Y_SLOW} y2={Y_SLOW} stroke={tokens.hairline} strokeWidth={1} />
          <rect x={RS.x0} y={Y_SLOW - 70} width={RS.x1 - RS.x0} height={140} fill={tokens.slow} fillOpacity={0.12} />
        </g>
      </svg>
      <Value x={QC.x0} y={Y_FAST - 118} text="fast quality check" size={26} hue={tokens.fast} opacity={sceneOn * on(s, 0.2, 0.6)} />
      <Value x={QC.x0} y={Y_FAST - 160} text="fast for all" size={36} opacity={sceneOn * on(s, 1.6, 2.1)} />
      <Value x={RS.x0} y={Y_SLOW - 118} text="neural-symbolic reasoning" size={26} hue={tokens.slow} opacity={sceneOn * on(s, 2.8, 3.2)} />
      <Value x={RS.x0} y={Y_SLOW - 160} text="deep reasoning when needed" size={36} opacity={sceneOn * on(s, 3.6, 4.1)} />
      {LOOP_WELDS.map((id, i) => {
        const e = ENTER[i];
        if (s < e) return null;
        const x = -220 + (s - e) * SPEED;
        const divert = i === DIVERT;
        const dip = divert ? track(x, [[QC.x1 + 40, 0], [QC.x1 + 300, 1]]) : 0;
        const y = Y_FAST + (Y_SLOW - Y_FAST) * dip;
        const passed = x > QC.x1 + 10;
        const reasoned = divert && x > RS.x1 + 10;
        const mark = divert ? (reasoned ? '✓' : passed ? '?' : '') : passed ? '✓' : '';
        const markHue = divert ? (reasoned ? tokens.slow : tokens.ink) : tokens.fast;
        return (
          <div key={id} style={{position: 'absolute', left: x, top: y - 28, height: 56, display: 'flex', alignItems: 'center', gap: 14, opacity: sceneOn}}>
            <div style={{border: `2px solid ${tokens.ink}`, padding: '0 16px 0 0', height: 56, display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 500, background: tokens.bg, fontVariantNumeric: 'tabular-nums'}}>
              <div style={{position: 'relative', width: 96, height: 52, overflow: 'hidden', background: '#111'}}>
                <Photo src={HISTORY[(i * 3 + 1) % HISTORY.length].src} natural={HISTORY[0].natural} width={96} height={52} view={HISTORY[(i * 3 + 1) % HISTORY.length].view} />
              </div>
              {id}
            </div>
            <div style={{fontSize: 34, fontWeight: 600, color: markHue, width: 40, opacity: mark ? lin(x, QC.x1 + 10, QC.x1 + 60) : 0}}>{mark}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', opacity: titleOn}}>
        <div style={{fontSize: 140, fontWeight: 600, letterSpacing: -4, lineHeight: 1, color: tokens.ink}}>WELDER</div>
        <div style={{fontSize: 36, fontWeight: 400, color: tokens.inkSoft, marginTop: 26, letterSpacing: -0.3}}>Neural-Symbolic AI for Next-Generation Smart Manufacturing</div>
      </div>
    </>
  );
};
