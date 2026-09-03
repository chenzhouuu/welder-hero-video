import React from 'react';
import type {SceneProps} from '../lib/scene';
import {LiveSensing} from './01-LiveSensing';
import {PostWeldVision} from './03-PostWeldVision';
import {Reasoning} from './05-Reasoning';
import {RootCauseAction} from './06-RootCauseAction';
import {rise} from '../lib/ease';
import {tokens} from '../styles/tokens';

const TW = 400;
const TH = 225;
const GAP = 24;
const X0 = (1920 - (4 * TW + 3 * GAP)) / 2;

/** A scene rendered small: the recap uses the real scenes, not icons. */
const Thumb: React.FC<{i: number; y: number; opacity: number; children: React.ReactNode}> = ({i, y, opacity, children}) => (
  <div style={{position: 'absolute', left: X0 + i * (TW + GAP), top: y, width: TW, height: TH, overflow: 'hidden', opacity, background: tokens.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${TW / 1920})`, transformOrigin: '0 0'}}>{children}</div>
  </div>
);

/**
 * Scene 7 — the loop, then the name. Four live thumbnails of what was just watched, one word
 * under each; the title arrives last.
 */
export const Vision: React.FC<SceneProps> = (props) => {
  const p = props.progress;
  const base = {...props, width: 1920, height: 1080};
  const y = 250;
  const labels = ['sense', 'perceive', 'reason', 'act'];
  const titleOn = rise(p, 0.55, 0.68);
  return (
    <>
      <Thumb i={0} y={y} opacity={rise(p, 0.02, 0.1)}>
        <LiveSensing {...base} progress={0.3 + 0.55 * p} dur={10} clipStartProgress={0.3} />
      </Thumb>
      <Thumb i={1} y={y} opacity={rise(p, 0.06, 0.14)}>
        <PostWeldVision {...base} progress={0.92} />
      </Thumb>
      <Thumb i={2} y={y} opacity={rise(p, 0.1, 0.18)}>
        <Reasoning {...base} progress={0.96} />
      </Thumb>
      <Thumb i={3} y={y} opacity={rise(p, 0.14, 0.22)}>
        <RootCauseAction {...base} progress={0.97} />
      </Thumb>
      {labels.map((l, i) => (
        <div key={l} style={{position: 'absolute', left: X0 + i * (TW + GAP), width: TW, top: y + TH + 18, textAlign: 'center', fontSize: 30, fontWeight: 500, color: tokens.ink, opacity: rise(p, 0.2 + i * 0.03, 0.28 + i * 0.03)}}>
          {l}
        </div>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', opacity: titleOn}}>
        <div style={{fontSize: 132, fontWeight: 600, letterSpacing: -4, lineHeight: 1, color: tokens.ink}}>WELDER</div>
        <div style={{fontSize: 36, fontWeight: 400, color: tokens.inkSoft, marginTop: 22, letterSpacing: -0.3}}>neural-symbolic weld diagnosis</div>
      </div>
    </>
  );
};
