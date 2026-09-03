import React from 'react';
import {GroundingBox, MaskFill} from '../../components/Grounding';
import {Marker, Region} from '../../components/marks';
import {asset} from '../../lib/asset';
import {tokens} from '../../styles/tokens';
import {lin, on, off, win} from '../../lib/track';
import {PHOTO_FRONT_SIZE} from '../../data/hero';
import {UNDERCUT_CLICK, undercutPath} from '../../data/marks';
import sam from '../../data/sam31.json';
import {T} from '../layout';

const V = T.vision.t0;
/** Beats inside chapter 3 (seconds after the cut to the photo). */
export const BEATS = {box: 1.5, label: 2.3, mask: 3.5, boxOff: 6.2, marker: 8.0, region: 8.4, chip: 9.6};
const SAM_BOX = {x0: sam.box[0], y0: sam.box[1], x1: sam.box[2], y1: sam.box[3]};

/**
 * Marks the vision model leaves on the photo, in IMAGE coordinates (mounted inside Photo).
 * Grounding box with score → mask fill → (push-in) → marker → defect region. The region
 * stays on the photo for the rest of the story; the box and mask are transient.
 */
export const visionPhotoMarks = (t: number, scale: number): React.ReactNode => {
  if (t < V) return null;
  const s = t - V;
  const boxOn = win(s, BEATS.box, BEATS.box + 0.2, BEATS.boxOff, BEATS.boxOff + 0.8);
  const maskOn = off(s, BEATS.boxOff + 0.4, BEATS.boxOff + 1.6);
  const regionOn = on(s, BEATS.region, BEATS.region + 0.35);
  const markerOn = win(s, BEATS.marker, BEATS.marker + 0.15, BEATS.region + 0.5, BEATS.region + 0.9);
  const later = t >= T.disagree.t0;
  return (
    <>
      {s < BEATS.boxOff + 1.7 ? (
        <>
          <MaskFill id="bead" href={asset(sam.mask)} w={PHOTO_FRONT_SIZE.w} h={PHOTO_FRONT_SIZE.h} reveal={lin(s, BEATS.mask, BEATS.mask + 1.6)} opacity={maskOn} rim={3} fill={0.38} />
          <GroundingBox box={SAM_BOX} label={`weld bead ${sam.score.toFixed(2)}`} draw={lin(s, BEATS.box, BEATS.box + 0.8)} labelOn={on(s, BEATS.label, BEATS.label + 0.25)} scale={scale} opacity={boxOn} />
        </>
      ) : null}
      <Region d={undercutPath()} hue={tokens.fast} opacity={regionOn} strokeWidth={2 / scale} fill={later ? 0.5 : 0.55} />
      <Marker cx={UNDERCUT_CLICK.x} cy={UNDERCUT_CLICK.y} r={13} opacity={markerOn} />
    </>
  );
};

/** Chapter 3 leaves no words on the frame besides the model's own labels; kept as a hook for the review. */
export const VisionPart: React.FC<{t: number}> = () => null;
