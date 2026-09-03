import {staticFile} from 'remotion';

/**
 * Resolve a file under public/ in both hosts.
 * Remotion Studio / renderer define window.remotion_staticBase; the Vite storyboard serves
 * public/ at the web root, where staticFile() would produce "undefined/…".
 */
export const asset = (p: string): string => {
  const w = typeof window !== 'undefined' ? (window as unknown as {remotion_staticBase?: string}) : undefined;
  if (w && typeof w.remotion_staticBase === 'string') return staticFile(p);
  return `/${p.replace(/^\/+/, '')}`;
};
