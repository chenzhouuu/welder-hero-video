import React from 'react';
import type {SceneProps} from '../lib/scene';
import {tokens} from '../styles/tokens';

/** Temporary stand-in until each keyframe is designed. */
export const placeholder = (title: string): React.FC<SceneProps> => {
  const P: React.FC<SceneProps> = ({progress, width, height}) => (
    <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
      <div style={{textAlign: 'center', color: tokens.inkSoft}}>
        <div style={{fontSize: 48, fontWeight: 500, letterSpacing: -0.5}}>{title}</div>
        <div style={{marginTop: 24, width: 600, height: 4, background: tokens.hairline, margin: '24px auto 0'}}>
          <div style={{width: `${progress * 100}%`, height: '100%', background: tokens.fast}} />
        </div>
        <div style={{marginTop: 12, fontSize: 20}}>{`${width}×${height} · progress ${progress.toFixed(2)}`}</div>
      </div>
    </div>
  );
  P.displayName = `Placeholder(${title})`;
  return P;
};
