import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {sceneById} from '../scenes/registry';
import {clamp01} from './ease';
import {tokens} from '../styles/tokens';

/**
 * Remotion-side adapter: turns the current frame into SceneProps and renders the scene.
 * Used identically by the render compositions and by the storyboard Player. Props are plain
 * data (a scene id) so that Remotion can serialise them.
 */
export const SceneHost: React.FC<{sceneId: string; durationInFrames?: number}> = ({sceneId, durationInFrames}) => {
  const scene = sceneById(sceneId);
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const total = durationInFrames ?? cfg.durationInFrames;
  const progress = total > 1 ? clamp01(frame / (total - 1)) : 1;
  const C = scene.Component;
  return (
    <AbsoluteFill style={{backgroundColor: tokens.bg, fontFamily: tokens.font, color: tokens.ink}}>
      <C progress={progress} t={frame / cfg.fps} dur={total / cfg.fps} frame={frame} fps={cfg.fps} width={cfg.width} height={cfg.height} />
    </AbsoluteFill>
  );
};
