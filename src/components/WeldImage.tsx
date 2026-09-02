import React from 'react';
import {Img, staticFile} from 'remotion';
import {colors, fonts} from '../styles/tokens';

type Props = {
  src: string;
  width: number;
  height: number;
  /** 0..1 position of a vertical scan line sweeping left→right; undefined = none */
  scan?: number;
  /** attention heat overlay strength 0..1 centred on the lower toe */
  heat?: number;
  /** relative box (x, y, w, h in 0..1) to draw as a detection/attention region */
  box?: [number, number, number, number];
  boxLabel?: string;
  caption?: string;
  opacity?: number;
  blur?: number;
  radius?: number;
  objectFit?: 'cover' | 'contain';
};

/** Real post-weld photo with optional neural-attention overlays. */
export const WeldImage: React.FC<Props> = ({src, width, height, scan, heat = 0, box, boxLabel, caption, opacity = 1, blur = 0, radius = 10, objectFit = 'cover'}) => {
  return (
    <div style={{position: 'relative', width, height, opacity, filter: blur ? `blur(${blur}px)` : undefined}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', border: `1px solid ${colors.panelEdge}`, background: '#000'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit, display: 'block'}} />
        {heat > 0 && box ? (
          <div
            style={{
              position: 'absolute',
              left: `${box[0] * 100}%`,
              top: `${box[1] * 100}%`,
              width: `${box[2] * 100}%`,
              height: `${box[3] * 100}%`,
              background: `radial-gradient(ellipse at 60% 70%, rgba(255,106,31,${0.55 * heat}), rgba(245,165,36,${0.25 * heat}) 45%, transparent 75%)`,
              mixBlendMode: 'screen',
            }}
          />
        ) : null}
        {scan !== undefined && scan >= 0 && scan <= 1 ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${scan * 100}%`,
              width: 3,
              background: colors.neural,
              boxShadow: `0 0 18px 4px ${colors.neuralGlow}`,
            }}
          />
        ) : null}
        {box ? (
          <div
            style={{
              position: 'absolute',
              left: `${box[0] * 100}%`,
              top: `${box[1] * 100}%`,
              width: `${box[2] * 100}%`,
              height: `${box[3] * 100}%`,
              border: `1.5px solid ${colors.neural}`,
              borderRadius: 4,
              opacity: heat > 0 ? Math.min(1, heat * 1.5) : 1,
            }}
          >
            {boxLabel ? (
              <div
                style={{
                  position: 'absolute',
                  left: -1,
                  top: -22,
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  letterSpacing: '0.14em',
                  color: colors.neural,
                  background: 'rgba(10,13,18,0.85)',
                  padding: '2px 6px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                {boxLabel}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {caption ? (
        <div style={{position: 'absolute', left: 0, top: height + 8, fontFamily: fonts.mono, fontSize: 13, color: colors.textDim, letterSpacing: '0.06em', whiteSpace: 'nowrap'}}>{caption}</div>
      ) : null}
    </div>
  );
};
