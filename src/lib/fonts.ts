import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/** Load the two variable fonts from public/fonts (no network at render time). */
export const loadFonts = (): Promise<void[]> =>
  Promise.all([
    loadFont({
      family: 'Inter Variable',
      url: staticFile('fonts/Inter.woff2'),
      weight: '100 900',
    }),
    loadFont({
      family: 'JetBrains Mono Variable',
      url: staticFile('fonts/JetBrainsMono.woff2'),
      weight: '100 800',
    }),
  ]);
