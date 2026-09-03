import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {WelderHero, TOTAL_FRAMES} from '@/Root';
import {FPS, HEIGHT, WIDTH} from '@/lib/scene';
import {loadFonts} from '@/lib/fonts';
import {Director} from './Director';

loadFonts();

const params = new URLSearchParams(window.location.search);
const director = params.get('director') === '1';

/** Plain mode: the whole sequence with the Player's own controls. */
const Sequence: React.FC = () => (
  <div className="stage" style={{height: '100%'}}>
    <div className="frame" style={{width: 'min(100%, calc((100vh - 24px) * 16 / 9))', aspectRatio: '16 / 9'}}>
      <Player
        component={WelderHero}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        compositionWidth={WIDTH}
        compositionHeight={HEIGHT}
        controls
        loop
        style={{width: '100%', height: '100%'}}
      />
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(director ? <Director /> : <Sequence />);
