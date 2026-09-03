import React from 'react';
import {Img} from 'remotion';
import {asset} from '../lib/asset';

type Props = {
  src: string;
  /** natural size of the image file */
  natural: {w: number; h: number};
  width: number;
  height: number;
  /**
   * Framing: the image rectangle (in image pixels) that should fill the box.
   * Defaults to the whole image, cover-fitted. Animate it to push in on a region.
   */
  view?: View;
  opacity?: number;
  children?: React.ReactNode;
};

export type View = {x: number; y: number; w: number; h: number};

/** Scale and offset that map image pixels to box pixels for a given framing. */
export const photoFit = (natural: {w: number; h: number}, view: View | undefined, width: number, height: number): {scale: number; tx: number; ty: number} => {
  const v = view ?? {x: 0, y: 0, w: natural.w, h: natural.h};
  const boxAr = width / height;
  const viewAr = v.w / v.h;
  const scale = viewAr > boxAr ? height / v.h : width / v.w;
  const cx = v.x + v.w / 2;
  const cy = v.y + v.h / 2;
  return {scale, tx: width / 2 - cx * scale, ty: height / 2 - cy * scale};
};

/**
 * A real photo with a camera-style framing transform. Children are drawn in IMAGE
 * pixel coordinates (an SVG the size of the image), so overlays stay glued to the pixels
 * while the view pushes in or out.
 */
export const Photo: React.FC<Props> = ({src, natural, width, height, view, opacity = 1, children}) => {
  const {scale, tx, ty} = photoFit(natural, view, width, height);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width, height, overflow: 'hidden', opacity}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: natural.w, height: natural.h, transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: '0 0'}}>
        <Img src={asset(src)} style={{width: natural.w, height: natural.h, display: 'block'}} />
        {children ? (
          <svg width={natural.w} height={natural.h} viewBox={`0 0 ${natural.w} ${natural.h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            {children}
          </svg>
        ) : null}
      </div>
    </div>
  );
};
