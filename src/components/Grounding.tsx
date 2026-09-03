import React from 'react';

/**
 * Grounding-DINO-style box with a label chip, drawn in IMAGE coordinates inside a Photo.
 * `draw` 0→1 traces the box; `scale` is the photo's current image→screen scale so that
 * stroke widths and the label stay the same size on screen while the camera pushes in.
 */
export const GroundingBox: React.FC<{box: {x0: number; y0: number; x1: number; y1: number}; label: string; draw: number; labelOn: number; scale: number; hue?: string; opacity?: number}> = ({box, label, draw, labelOn, scale, hue = '#fff', opacity = 1}) => {
  const w = box.x1 - box.x0;
  const h = box.y1 - box.y0;
  const per = 2 * (w + h);
  const sw = 2.5 / scale;
  const fs = 26 / scale;
  const pad = 8 / scale;
  const chipH = fs * 1.35;
  const chipW = label.length * fs * 0.56 + 2 * pad;
  return (
    <g opacity={opacity}>
      <rect x={box.x0} y={box.y0} width={w} height={h} fill="none" stroke={hue} strokeWidth={sw} strokeDasharray={`${per} ${per}`} strokeDashoffset={per * (1 - draw)} />
      <g opacity={labelOn}>
        <rect x={box.x0} y={box.y0 - chipH - sw} width={chipW} height={chipH} fill={hue} />
        <text x={box.x0 + pad} y={box.y0 - sw - chipH * 0.3} fontSize={fs} fontWeight={500} fill="#161616" fontFamily='"Inter Variable", Inter, system-ui, sans-serif' style={{fontVariantNumeric: 'tabular-nums'}}>
          {label}
        </text>
      </g>
    </g>
  );
};

/**
 * SAM-style mask fill from a binary mask image (same size as the photo): a solid rim from a
 * dilated copy of the mask, a translucent fill inside. `reveal` 0→1 wipes the fill in from
 * the left, as segmentation demos do. Image coordinates.
 */
export const MaskFill: React.FC<{href: string; w: number; h: number; reveal: number; hue?: string; fill?: number; rim?: number; opacity?: number; id: string}> = ({href, w, h, reveal, hue = '#fff', fill = 0.42, rim = 6, opacity = 1, id}) => (
  <g opacity={opacity}>
    <defs>
      <filter id={`${id}-dilate`} x="-5%" y="-5%" width="110%" height="110%">
        <feMorphology operator="dilate" radius={rim} />
      </filter>
      <filter id={`${id}-punch`} x="0" y="0" width="100%" height="100%">
        {/* black where the mask is, transparent elsewhere: subtracts the interior from the dilated copy */}
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.33 0.33 0.33 0 0" />
      </filter>
      <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
        <image href={href} x={0} y={0} width={w} height={h} />
      </mask>
      <mask id={`${id}-md`} maskUnits="userSpaceOnUse" x={0} y={0} width={w} height={h}>
        <image href={href} x={0} y={0} width={w} height={h} filter={`url(#${id}-dilate)`} />
        <image href={href} x={0} y={0} width={w} height={h} filter={`url(#${id}-punch)`} />
      </mask>
      <clipPath id={`${id}-clip`}>
        <rect x={0} y={0} width={w * reveal} height={h} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id}-clip)`}>
      <rect x={0} y={0} width={w} height={h} fill={hue} mask={`url(#${id}-md)`} fillOpacity={0.95} />
      <rect x={0} y={0} width={w} height={h} fill={hue} mask={`url(#${id}-m)`} fillOpacity={fill} style={{mixBlendMode: 'normal'}} />
    </g>
  </g>
);
