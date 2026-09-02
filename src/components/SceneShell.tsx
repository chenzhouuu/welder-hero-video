import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, fadeOut} from '../lib/anim';

type Props = {
  children: React.ReactNode;
  duration: number;
  bg?: string;
  grid?: boolean;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  /** 0 = warm (neural), 1 = cool (symbolic); tints the vignette. */
  temperature?: number;
};

/** Background, vignette, optional grid, and the scene's own enter/exit fade. */
export const SceneShell: React.FC<Props> = ({
  children,
  duration,
  bg = colors.bg,
  grid = true,
  fadeInFrames = 14,
  fadeOutFrames = 14,
  temperature = 0.5,
}) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(fadeIn(frame, 0, fadeInFrames), fadeOut(frame, duration, fadeOutFrames));
  const warm = `rgba(245,165,36,${0.10 * (1 - temperature)})`;
  const cool = `rgba(56,214,240,${0.10 * temperature})`;
  return (
    <AbsoluteFill style={{backgroundColor: bg, fontFamily: fonts.sans, color: colors.text, opacity}}>
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            backgroundPosition: '0 0',
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 20% 80%, ${warm}, transparent 55%), radial-gradient(ellipse at 80% 20%, ${cool}, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
