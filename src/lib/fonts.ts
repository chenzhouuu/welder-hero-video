import {loadFont} from '@remotion/fonts';
import {asset} from './asset';

let loaded: Promise<void> | undefined;
/** Inter variable from public/fonts; safe to call in both hosts. */
export const loadFonts = (): Promise<void> => {
  if (!loaded) {
    loaded = loadFont({family: 'Inter Variable', url: asset('fonts/Inter.woff2'), weight: '100 900'}).catch(() => undefined);
  }
  return loaded;
};
