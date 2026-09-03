import React from 'react';
import {TraceLane, laneScales, type Lane} from '../../components/TraceLane';
import {Sweep} from '../../components/Sweep';
import {Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {lin, on, off, win, inside} from '../../lib/track';
import {tLogAt, WINDOW_S, TICKER_WELDS} from '../../data/story';
import {ARC_ON_S} from '../../data/hero';
import {tickerSignals} from '../../data/tickers';
import {T, CHANNELS} from '../layout';

/** Story seconds at which the fast monitor judged one window (ticks left on the current lane). */
const TICK_TIMES = [14.6, 15.4, 16.2, 17.0, 17.8, 18.6, 19.3];
const ROW_T0 = [14.6, 15.8, 17.0];

/**
 * Chapters 1–2 overlays: the fast monitor's sliding window trailing the write head on the
 * three lanes, the ticks it leaves behind, and three earlier welds passing the same check
 * at the top right (real logs of good welds; IDs illustrative).
 */
export const WeldPart: React.FC<{t: number; lanes: Lane[]}> = ({t, lanes}) => {
  const tLog = tLogAt(t);
  const {x: xt} = laneScales(lanes[0]);
  const arcOffT = (ARC_ON_S[1] - tLogAt(0)) / (tLogAt(1) - tLogAt(0));
  const sweepOn = win(t, T.fast.t0 + 1.5, T.fast.t0 + 2.3, arcOffT + 0.2, arcOffT + 1.0);
  const x1 = xt(Math.min(tLog, ARC_ON_S[1]));
  const x0 = xt(Math.max(ARC_ON_S[0] - 0.5, Math.min(tLog, ARC_ON_S[1]) - WINDOW_S));
  const ticks = TICK_TIMES.filter((tt) => t >= tt).map((tt) => xt(tLogAt(tt) - WINDOW_S / 2));
  const rows = TICKER_WELDS.map((id, i) => ({id, t0: ROW_T0[i], sig: tickerSignals[i], y: 90 + i * 150}));
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {lanes.map((lane, i) => (
          <Sweep key={i} x0={x0} x1={x1} y0={lane.y} y1={lane.y + lane.h} opacity={sweepOn * (i === 0 ? 1 : 0.7)} ticks={i === 0 ? ticks : []} />
        ))}
        {/* earlier welds through the same fast path */}
        {rows.map((r) => {
          const lane: Lane = {x: 1180, y: r.y, w: 560, h: 84, tRange: [0, 42], vRange: CHANNELS[0].v};
          const rowOn = on(t, r.t0, r.t0 + 0.3) * off(t, T.vision.t0 - 0.6, T.vision.t0 - 0.1);
          const write = lin(t, r.t0, r.t0 + 0.8);
          const tEnd = r.sig.t[0] + (r.sig.t[r.sig.t.length - 1] - r.sig.t[0]) * write;
          const {x: rx} = laneScales(lane);
          const sw = lin(t, r.t0 + 0.9, r.t0 + 1.4);
          const sx1 = rx(r.sig.t[0] + (r.sig.t[r.sig.t.length - 1] - r.sig.t[0]) * sw);
          const sweepVis = win(t, r.t0 + 0.9, r.t0 + 1.0, r.t0 + 1.4, r.t0 + 1.6);
          return (
            <g key={r.id} opacity={rowOn}>
              <TraceLane lane={lane} t={r.sig.t} v={r.sig.current_A} tEnd={tEnd} strokeWidth={2} />
              <Sweep x0={Math.max(lane.x, sx1 - 90)} x1={sx1} y0={lane.y} y1={lane.y + lane.h} opacity={sweepVis} />
            </g>
          );
        })}
      </svg>
      {rows.map((r) => {
        const rowOn = on(t, r.t0, r.t0 + 0.3) * off(t, T.vision.t0 - 0.6, T.vision.t0 - 0.1);
        const okOn = on(t, r.t0 + 1.5, r.t0 + 1.8);
        return (
          <React.Fragment key={r.id}>
            <Value x={1040} y={r.y + 28} text={r.id} size={26} hue={tokens.inkSoft} opacity={rowOn} />
            <Value x={1760} y={r.y + 26} text="✓" size={30} hue={tokens.fast} opacity={rowOn * okOn} />
          </React.Fragment>
        );
      })}
      {/* log clock while welding (top-right of the footage) */}
      {inside(t, 0, T.vision.t0) ? <Value x={t < T.fast.t0 + 0.75 ? 1920 - 96 : 960 - 24} y={t < T.fast.t0 + 0.75 ? 64 : 28} text={`${tLog.toFixed(1)} s`} hue="rgba(255,255,255,0.85)" size={t < T.fast.t0 + 0.75 ? 30 : 24} align="right" /> : null}
    </>
  );
};
