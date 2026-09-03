import {BEAD_BOX_FRONT} from './hero';
import edge from './bead-edge.json';

/**
 * Undercut region on the front photo (2000×900 image pixels). The band follows the REAL
 * lower edge of the SAM 3.1 bead mask (bead-edge.json) over the middle-to-right of the bead,
 * where the teacher chain-of-evidence places the groove ("continuous groove along the lower
 * toe, most pronounced middle-to-right"). Its extent and thickness are ILLUSTRATIVE: no
 * defect-segmentation output exists for this weld; tagged in provenance.json.
 */
export const undercutPath = (): string => {
  const xs = edge.x;
  const ys = edge.y;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    top.push(`${x},${(y - 3 + 0.8 * Math.sin(x / 19)).toFixed(1)}`);
    bot.push(`${x},${(y + 7 + 1.2 * Math.sin(x / 23 + 1)).toFixed(1)}`);
  }
  return `M${top.join('L')}L${bot.reverse().join('L')}Z`;
};
export const UNDERCUT_BOX = {x0: edge.x[0], y0: Math.min(...edge.y) - 4, x1: edge.x[edge.x.length - 1], y1: Math.max(...edge.y) + 8};
/** Where the marker lands (image px): on the lower toe, middle-right of the band. */
export const UNDERCUT_CLICK = {x: edge.x[Math.floor(edge.x.length * 0.55)], y: edge.y[Math.floor(edge.x.length * 0.55)] + 2};
export {BEAD_BOX_FRONT};
