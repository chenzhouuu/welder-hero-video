import React from 'react';
import type {SceneProps} from '../lib/scene';
import {Photo, photoFit} from '../components/Photo';
import {Chip, Marker, Region, Stamp} from '../components/marks';
import {PHOTO_FRONT, PHOTO_FRONT_SIZE} from '../data/hero';
import {UNDERCUT_BOX, UNDERCUT_CLICK, undercutPath} from '../data/marks';
import {VIEW_BEAD, VIEW_PLATE, lerpView} from '../lib/layout';
import {easeInOutCubic, rise, seg, window01} from '../lib/ease';
import {tokens} from '../styles/tokens';

/**
 * Scene 3 — the fast layer looks at the weld. The real photo fills the frame and the camera
 * pushes in on the bead; a marker lands on the lower toe, the undercut region fills, one word.
 */
export const PostWeldVision: React.FC<SceneProps> = ({progress: p, width, height}) => {
  const k = easeInOutCubic(seg(p, 0.1, 0.72));
  const view = lerpView(VIEW_PLATE, VIEW_BEAD, k);
  const fit = photoFit(PHOTO_FRONT_SIZE, view, width, height);
  const markerOn = window01(p, 0.24, 0.28, 0.5, 0.58);
  const regionOn = rise(p, 0.3, 0.36);
  const chipOn = rise(p, 0.38, 0.44);
  const chipX = fit.tx + UNDERCUT_BOX.x0 * fit.scale;
  const chipY = fit.ty + UNDERCUT_BOX.y0 * fit.scale - 44 - 6;
  return (
    <>
      <Photo src={PHOTO_FRONT} natural={PHOTO_FRONT_SIZE} width={width} height={height} view={view}>
        <Region d={undercutPath()} hue={tokens.fast} opacity={regionOn} strokeWidth={2 / fit.scale} />
        <Marker cx={UNDERCUT_CLICK.x} cy={UNDERCUT_CLICK.y} r={13} opacity={markerOn} />
      </Photo>
      <Chip x={chipX} y={chipY} hue={tokens.fast} text="undercut" opacity={chipOn} />
      <Stamp text="fast layer" hue={tokens.fast} />
    </>
  );
};
