/** Frame geometry shared by scenes 4–6 (photo above, cause band, trace below). */
export const W = 1920;
export const H = 1080;

export const SPLIT = {
  photo: {x: 0, y: 0, w: 1920, h: 440},
  band: {y: 440, h: 180},
  trace: {x: 160, y: 660, w: 1600, h: 360},
} as const;

/** Bead framing for the front photo (2000×900) at the split's 4.36:1 photo aspect. */
export const VIEW_BEAD_SPLIT = {x: 600, y: 227, w: 780, h: 179};
/** 16:9 framings for the full-frame photo scene. */
export const VIEW_PLATE = {x: 470, y: 45, w: 1040, h: 585};
export const VIEW_BEAD = {x: 620, y: 128, w: 740, h: 416};
/** Good weld (02-17-23-0106-00) front photo, bead framing at the split aspect. */
export const VIEW_GOOD_BEAD_SPLIT = {x: 630, y: 236, w: 780, h: 179};

/** Interpolate two view rectangles. */
export const lerpView = (a: {x: number; y: number; w: number; h: number}, b: {x: number; y: number; w: number; h: number}, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});
