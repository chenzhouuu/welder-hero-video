/**
 * Design tokens for the WELDER hero video.
 *
 * Two visual languages, kept deliberately distinct:
 *  - NEURAL: warm, continuous, glowing (molten metal, streaming signals).
 *  - SYMBOLIC: cool, discrete, hairline (tokens, graph edges, rules).
 * The warm→cool hand-off is the visual signature of the neural→symbolic interface.
 */

export const colors = {
  bg: '#0A0D12',
  bg2: '#10151D',
  panel: '#151B25',
  panelEdge: '#242C39',
  grid: 'rgba(120, 140, 170, 0.08)',

  text: '#ECEFF4',
  textMuted: '#98A2B3',
  textDim: '#5C6675',

  // neural (warm)
  neural: '#F5A524',
  neuralHot: '#FF6A1F',
  neuralSoft: '#FFC466',
  neuralGlow: 'rgba(245, 165, 36, 0.35)',

  // symbolic (cool)
  symbolic: '#38D6F0',
  symbolicDeep: '#1FA5BF',
  symbolicSoft: '#A9E8F5',
  symbolicGlow: 'rgba(56, 214, 240, 0.30)',

  // verdicts
  supported: '#34D399',
  weakened: '#F87171',
  plausible: '#FBBF24',
  abnormal: '#FF6A1F',
  nominal: '#38D6F0',

  // signal channels (conventional, distinguishable)
  chCurrent: '#F5A524',
  chVoltage: '#FF7A59',
  chFeed: '#E9D66B',
  chGas: '#7DD3FC',
  chPressure: '#C4B5FD',
} as const;

export const fonts = {
  sans: '"Inter Variable", "Inter", "Noto Sans", "Liberation Sans", sans-serif',
  mono: '"JetBrains Mono Variable", "JetBrains Mono", "DejaVu Sans Mono", monospace',
} as const;

export const type = {
  hero: 88,
  h1: 64,
  h2: 44,
  h3: 32,
  body: 24,
  small: 19,
  micro: 15,
} as const;

export const layout = {
  W: 1920,
  H: 1080,
  margin: 96,
  radius: 14,
} as const;
