import React from 'react';
import {AbsoluteFill, Composition, Series} from 'remotion';
import {SCENES} from './scenes/registry';
import {SceneHost} from './lib/SceneHost';
import {FPS, HEIGHT, WIDTH, framesOf} from './lib/scene';
import {loadFonts} from './lib/fonts';

loadFonts();

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + framesOf(s), 0);

/** All scenes back to back. Transitions are added at design freeze, not before. */
export const WelderHero: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {SCENES.map((s) => (
        <Series.Sequence key={s.id} durationInFrames={framesOf(s)} name={`${s.n} ${s.title}`}>
          <SceneHost sceneId={s.id} durationInFrames={framesOf(s)} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="WelderHero" component={WelderHero} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    {SCENES.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={SceneHost}
        defaultProps={{sceneId: s.id}}
        durationInFrames={framesOf(s)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
