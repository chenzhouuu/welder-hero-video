import React from 'react';
import type {SceneProps} from '../lib/scene';
import {ArcClip} from '../components/ArcClip';
import {Photo, photoFit} from '../components/Photo';
import {TraceLane, laneScales} from '../components/TraceLane';
import {Chip, Value} from '../components/marks';
import {tokens} from '../styles/tokens';
import {on, off} from '../lib/track';
import {ARC_ON_S, PHOTO_FRONT, PHOTO_FRONT_SIZE, signals} from '../data/hero';
import {UNDERCUT_BOX} from '../data/marks';
import {FAST_FINDING, LABELS, LOG_SPEED, LOG_T0, tLogAt} from '../data/story';
import {T, CHANNELS, videoRect, laneRects, photoRect, photoView} from './layout';
import {WeldPart} from './parts/Weld';
import {VisionPart, visionPhotoMarks, BEATS} from './parts/Vision';
import {DisagreePart} from './parts/Disagree';
import {ReasonPart} from './parts/Reason';
import {MemoryPart} from './parts/Memory';
import {TrainingPart} from './parts/Training';
import {LoopPart} from './parts/Loop';

/**
 * The whole video as one function of time. Persistent objects (footage, traces, photo, the
 * two fast findings, the weld's ID) are drawn here from their tracks; chapter parts add
 * what happens to them. Chapter 9 is a hard cut to its own composition; chapter 8 grows out
 * of chapter 7's memory.
 */
export const Story: React.FC<SceneProps> = ({t}) => {
  if (t >= T.loop.t0) return <LoopPart t={t} />;
  const tLog = tLogAt(t);
  const welding = t < T.vision.t0;
  const vr = videoRect(t);
  const {lanes, opacity, ink, unitOpacity} = laneRects(t);
  const pr = photoRect(t);
  const view = photoView(t);
  const fit = photoFit(PHOTO_FRONT_SIZE, view, pr.w, pr.h);
  const showPhoto = t >= T.vision.t0 && t < T.memory.t0 + 1.5;
  const arcOffT = (ARC_ON_S[1] - LOG_T0) / LOG_SPEED;
  // fast finding on the trace: appears when the arc goes out, stays with the lane
  const {x: xt} = laneScales(lanes[0]);
  const stableOn = on(t, arcOffT + 0.3, arcOffT + 0.7) * off(t, T.memory.t0, T.memory.t0 + 0.6);
  const chipSize = t >= T.vision.t0 && t < T.disagree.t0 + 0.8 ? 20 : 26;
  const chipX = Math.min(xt(ARC_ON_S[1]) - 20, lanes[0].x + lanes[0].w - 250) - 20;
  const chipY = lanes[0].y - (chipSize === 20 ? 34 : 46);
  // fast finding on the photo: follows the region through every framing
  const ucX = pr.x + fit.tx + UNDERCUT_BOX.x0 * fit.scale;
  const ucY = pr.y + fit.ty + UNDERCUT_BOX.y0 * fit.scale - 48;
  const undercutOn = on(t, T.vision.t0 + BEATS.chip, T.vision.t0 + BEATS.chip + 0.35) * off(t, T.memory.t0, T.memory.t0 + 0.6);
  const groove = {x: pr.x + fit.tx + ((UNDERCUT_BOX.x0 + UNDERCUT_BOX.x1) / 2 + 60) * fit.scale, y: pr.y + fit.ty + UNDERCUT_BOX.y1 * fit.scale + 4};
  const defectChip = {x: ucX + 60, y: ucY + 40};
  const idOnDark = t < T.memory.t0;
  const idOn = off(t, T.memory.t0, T.memory.t0 + 0.5);
  return (
    <>
      {welding ? (
        <div style={{position: 'absolute', left: vr.x, top: vr.y, width: vr.w, height: vr.h}}>
          <ArcClip tLogStart={LOG_T0} speed={LOG_SPEED} width={vr.w} height={vr.h} />
        </div>
      ) : null}
      {showPhoto ? (
        <div style={{position: 'absolute', left: pr.x, top: pr.y, width: pr.w, height: pr.h}}>
          <Photo src={PHOTO_FRONT} natural={PHOTO_FRONT_SIZE} width={pr.w} height={pr.h} view={view}>
            {visionPhotoMarks(t, fit.scale)}
          </Photo>
        </div>
      ) : null}
      {t < T.memory.t0 + 1 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {lanes.map((lane, i) =>
            opacity[i] > 0 ? (
              <TraceLane key={CHANNELS[i].key} lane={lane} t={signals.t} v={signals[CHANNELS[i].key]} tEnd={welding ? tLog : undefined} ink={ink} strokeWidth={welding ? 2.5 : i === 0 ? 3 : 2.2} head={welding} opacity={opacity[i]} />
            ) : null,
          )}
        </svg>
      ) : null}
      {CHANNELS.map((c, i) => (
        <Value key={c.key} x={lanes[i].x + lanes[i].w + 18} y={lanes[i].y + lanes[i].h - 24} text={c.unit} hue={welding && t < T.fast.t0 + 0.75 ? 'rgba(255,255,255,0.8)' : tokens.inkSoft} size={24} opacity={unitOpacity * opacity[i]} />
      ))}
      {welding ? <WeldPart t={t} lanes={lanes} /> : null}
      {t >= T.vision.t0 && t < T.disagree.t0 ? <VisionPart t={t} /> : null}
      {t >= T.disagree.t0 && t < T.reason.t0 + 1 ? <DisagreePart t={t} groove={groove} lane={lanes[0]} /> : null}
      {t >= T.reason.t0 && t < T.memory.t0 + 1.6 ? <ReasonPart t={t} groove={groove} defectChip={defectChip} lanes={lanes} /> : null}
      {t >= T.memory.t0 ? <MemoryPart t={t} /> : null}
      {t >= T.training.t0 ? <TrainingPart t={t} /> : null}
      {/* the two fast findings */}
      <Chip x={chipX} y={chipY} hue={tokens.fast} text={FAST_FINDING} size={chipSize} opacity={stableOn} />
      <Chip x={ucX} y={ucY} hue={tokens.fast} text="undercut" size={26} opacity={undercutOn} />
      {/* the weld's identity, from the first frame */}
      <Value x={48} y={40} text={LABELS.weld} size={24} hue={idOnDark ? 'rgba(255,255,255,0.9)' : tokens.ink} opacity={idOn} />
    </>
  );
};
