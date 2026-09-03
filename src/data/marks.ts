import {BEAD_BOX_FRONT} from './hero';

/**
 * Undercut region on the front photo (2000×900 image pixels). ILLUSTRATIVE: a thin band along
 * the lower weld toe, middle-to-right of the bead, following the teacher chain-of-evidence
 * description ("continuous groove along the lower toe, most pronounced middle-to-right"). Not a
 * model output; tagged in provenance.json.
 */
export const undercutPath = (): string => {
  const x0 = 950;
  const x1 = 1245;
  const top = (x: number): number => 318.5 - 0.007 * (x - x0) + 1.2 * Math.sin(x / 17);
  const bot = (x: number): number => top(x) + 8 + 1.5 * Math.sin(x / 23 + 1);
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 6) pts.push(`${x.toFixed(1)},${top(x).toFixed(1)}`);
  for (let x = x1; x >= x0; x -= 6) pts.push(`${x.toFixed(1)},${bot(x).toFixed(1)}`);
  return `M${pts.join('L')}Z`;
};
export const UNDERCUT_BOX = {x0: 950, y0: 314, x1: 1245, y1: 329};
/** Where the marker lands (image px), on the lower toe near the middle-right. */
export const UNDERCUT_CLICK = {x: 1110, y: 322};
export {BEAD_BOX_FRONT};
