import React from 'react';
import {Photo, type View} from './Photo';
import {tokens} from '../styles/tokens';

export type ThumbSpec = {
  id: string;
  label: string;
  status: 'good' | 'undercut';
  src: string;
  natural: {w: number; h: number};
  view: View;
  /** SVG drawn in image coordinates (e.g. the stored defect region) */
  children?: React.ReactNode;
};

/**
 * A weld as a visual object: the real photo (bead framing) with its ID and status written
 * under it. Status is a word in the finding's hue for undercut, soft ink for good; no card.
 */
export const WeldThumb: React.FC<{spec: ThumbSpec; x: number; y: number; w: number; h: number; opacity?: number; labelOn?: number; children?: React.ReactNode}> = ({spec, x, y, w, h, opacity = 1, labelOn = 1, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, opacity}}>
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden', background: '#111'}}>
      <Photo src={spec.src} natural={spec.natural} width={w} height={h} view={spec.view}>
        {spec.children}
      </Photo>
      {children}
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 24, fontWeight: 500, lineHeight: 1, opacity: labelOn}}>
      <span style={{color: tokens.ink, fontVariantNumeric: 'tabular-nums'}}>{spec.label}</span>
      <span style={{color: spec.status === 'undercut' ? tokens.fast : tokens.inkSoft}}>{spec.status}</span>
    </div>
  </div>
);
