/** Small geometry helpers for links drawn on the data. */
export type Pt = {x: number; y: number};

const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t});

/** Quadratic Bézier from p0 to p2 with control p1, cut at parameter t (De Casteljau). */
export const partialQuad = (p0: Pt, p1: Pt, p2: Pt, t: number): string => {
  const u = Math.max(0, Math.min(1, t));
  if (u <= 0) return '';
  const a = lerpPt(p0, p1, u);
  const b = lerpPt(p1, p2, u);
  const m = lerpPt(a, b, u);
  return `M${p0.x.toFixed(1)},${p0.y.toFixed(1)}Q${a.x.toFixed(1)},${a.y.toFixed(1)} ${m.x.toFixed(1)},${m.y.toFixed(1)}`;
};

/** Point on the quadratic at t (for placing a word on the line). */
export const quadAt = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => {
  const a = lerpPt(p0, p1, t);
  const b = lerpPt(p1, p2, t);
  return lerpPt(a, b, t);
};

/** A gently bowed control point between two points. */
export const bow = (p0: Pt, p2: Pt, amount = 0.18): Pt => {
  const mx = (p0.x + p2.x) / 2;
  const my = (p0.y + p2.y) / 2;
  const dx = p2.x - p0.x;
  const dy = p2.y - p0.y;
  return {x: mx - dy * amount, y: my + dx * amount};
};
