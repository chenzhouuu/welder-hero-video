import React from 'react';
import {Video} from 'remotion';
import {asset} from '../lib/asset';
import {ARC_VIDEO, ARC_VIDEO_SIZE, VIDEO_SCALE, logToVideoS} from '../data/hero';

type Props = {
  /** process-log time (seconds) shown at the first frame of the scene */
  tLogStart: number;
  /** log seconds per scene second (time compression) */
  speed: number;
  width: number;
  height: number;
  /** cover the box (crop) or fit inside it */
  fit?: 'cover' | 'contain';
  opacity?: number;
};

/**
 * The real arc video of the hero weld, addressed by process-log time so that the
 * footage and the sensor traces stay in sync. <Video> (not OffthreadVideo) because the
 * Remotion compositor binary needs glibc ≥ 2.35 and this host has 2.31; <Video> seeks the
 * browser's own decoder in both the Player and the renderer.
 */
export const ArcClip: React.FC<Props> = ({tLogStart, speed, width, height, fit = 'cover', opacity = 1}) => {
  const startFrom = Math.max(0, Math.round(logToVideoS(tLogStart) * 30));
  const playbackRate = speed * VIDEO_SCALE;
  const ar = ARC_VIDEO_SIZE.w / ARC_VIDEO_SIZE.h;
  const boxAr = width / height;
  const scale = fit === 'cover' ? (boxAr > ar ? width / ARC_VIDEO_SIZE.w : height / ARC_VIDEO_SIZE.h) : boxAr > ar ? height / ARC_VIDEO_SIZE.h : width / ARC_VIDEO_SIZE.w;
  const w = ARC_VIDEO_SIZE.w * scale;
  const h = ARC_VIDEO_SIZE.h * scale;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width, height, overflow: 'hidden', background: '#000', opacity}}>
      <Video
        src={asset(ARC_VIDEO)}
        startFrom={startFrom}
        playbackRate={playbackRate}
        muted
        style={{position: 'absolute', left: (width - w) / 2, top: (height - h) / 2, width: w, height: h}}
      />
    </div>
  );
};
