import React from 'react';
import {TraceLane, laneScales, type Lane} from '../../components/TraceLane';
import {Sweep} from '../../components/Sweep';
import {Value} from '../../components/marks';
import {tokens} from '../../styles/tokens';
import {lin, on, off, win, inside, track} from '../../lib/track';
import {tLogAt, WINDOW_S, TICKER_WELDS} from '../../data/story';
import {ARC_ON_S} from '../../data/hero';
import {tickerSignals} from '../../data/tickers';
import {T, CHANNELS} from '../layout';

/** Story seconds at which the fast monitor judged one window (ticks left on the current lane). */
const TICK_TIMES = [14.6, 15.4, 16.2, 17.0, 17.8, 18.6, 19.3];
/** The production stream at the top right: one earlier weld every 0.6 s, five rows visible, older rows scroll up. */
const ROW_T0 = 14.0;
const ROW_DT = 0.6;
const ROW_H = 92;
const VISIBLE = 5;
const COL = {x: 1040, y: 70, laneX: 1190, laneW: 540};

/**
 * Chapters 1–2 overlays: the fast monitor's sliding window trailing the write head on the
 * three lanes, the ticks it leaves behind, and the production stream of earlier welds passing
 * the same check (real logs of good welds; IDs illustrative). Attention returns to Weld 087
 * when the arc goes out.
 */
export const WeldPart: React.FC<{t: number; lanes: Lane[]}> = ({t, lanes}) => {
  const tLog = tLogAt(t);
  const {x: xt} = laneScales(lanes[0]);
  const arcOffT = (ARC_ON_S[1] - tLogAt(0)) / (tLogAt(1) - tLogAt(0));
  const sweepOn = win(t, T.fast.t0 + 1.5, T.fast.t0 + 2.3, arcOffT + 0.2, arcOffT + 1.0);
  const x1 = xt(Math.min(tLog, ARC_ON_S[1]));
  const x0 = xt(Math.max(ARC_ON_S[0] - 0.5, Math.min(tLog, ARC_ON_S[1]) - WINDOW_S));
  const ticks = TICK_TIMES.filter((tt) => t >= tt).map((tt) => xt(tLogAt(tt) - WINDOW_S / 2));
  const entered = Math.max(0, Math.min(TICKER_WELDS.length, Math.floor((t - ROW_T0) / ROW_DT) + 1));
  const scroll = track(t, [[ROW_T0 + (VISIBLE - 1) * ROW_DT, 0], ...TICKER_WELDS.slice(VISIBLE).map((_, k): [number, number] => [ROW_T0 + (VISIBLE + k) * ROW_DT + 0.35, (k + 1) * ROW_H])], (u) => u);
  const streamOff = off(t, T.vision.t0 - 0.8, T.vision.t0 - 0.2);
  const rows = TICKER_WELDS.map((id, i) => ({id, t0: ROW_T0 + i * ROW_DT, sig: tickerSignals[i % tickerSignals.length], y: COL.y + i * ROW_H - scroll}));
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {lanes.map((lane, i) => (
          <Sweep key={i} x0={x0} x1={x1} y0={lane.y} y1={lane.y + lane.h} opacity={sweepOn * (i === 0 ? 1 : 0.7)} ticks={i === 0 ? ticks : []} />
        ))}
        <defs>
          <clipPath id="stream-clip">
            <rect x={COL.x - 10} y={COL.y - 10} width={1920 - COL.x} height={VISIBLE * ROW_H + 10} />
          </clipPath>
        </defs>
        <g clipPath="url(#stream-clip)" opacity={streamOff}>
          {rows.slice(0, entered).map((r) => {
            const lane: Lane = {x: COL.laneX, y: r.y + 4, w: COL.laneW, h: ROW_H - 24, tRange: [0, 42], vRange: CHANNELS[0].v};
            const write = lin(t, r.t0, r.t0 + 0.45);
            const span = r.sig.t[r.sig.t.length - 1] - r.sig.t[0];
            const tEnd = r.sig.t[0] + span * write;
            const {x: rx} = laneScales(lane);
            const sw = lin(t, r.t0 + 0.4, r.t0 + 0.75);
            const sx1 = rx(r.sig.t[0] + span * sw);
            const sweepVis = win(t, r.t0 + 0.4, r.t0 + 0.45, r.t0 + 0.75, r.t0 + 0.9);
            return (
              <g key={r.id} opacity={on(t, r.t0, r.t0 + 0.15)}>
                <TraceLane lane={lane} t={r.sig.t} v={r.sig.current_A} tEnd={tEnd} strokeWidth={1.8} />
                <Sweep x0={Math.max(lane.x, sx1 - 70)} x1={sx1} y0={lane.y} y1={lane.y + lane.h} opacity={sweepVis} />
              </g>
            );
          })}
        </g>
      </svg>
      <div style={{position: 'absolute', left: COL.x - 10, top: COL.y - 10, width: 1920 - COL.x, height: VISIBLE * ROW_H + 10, overflow: 'hidden', opacity: streamOff}}>
        {rows.slice(0, entered).map((r) => (
          <React.Fragment key={r.id}>
            <Value x={10} y={r.y - COL.y + 10 + 28} text={r.id} size={24} hue={tokens.inkSoft} opacity={on(t, r.t0, r.t0 + 0.15)} />
            <Value x={COL.laneX + COL.laneW - COL.x + 34} y={r.y - COL.y + 10 + 26} text="✓" size={28} hue={tokens.fast} opacity={on(t, r.t0 + 0.8, r.t0 + 0.95)} />
          </React.Fragment>
        ))}
      </div>
      {/* log clock while welding (top-right of the footage) */}
      {inside(t, 0, T.vision.t0) ? <Value x={t < T.fast.t0 + 0.75 ? 1920 - 96 : 960 - 24} y={t < T.fast.t0 + 0.75 ? 64 : 28} text={`${tLog.toFixed(1)} s`} hue="rgba(255,255,255,0.85)" size={t < T.fast.t0 + 0.75 ? 30 : 24} align="right" /> : null}
    </>
  );
};
