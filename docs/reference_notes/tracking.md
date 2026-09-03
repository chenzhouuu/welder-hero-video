# Reference notes: video understanding / tracking demos

Studied 2026-09-02 from downloaded demo media (16 videos / GIFs, frames viewed). Cutie and MASA
are CVPR 2024 Highlights; CoTracker is ECCV 2024; OmniMotion is ICCV 2023 Oral. XMem (ECCV 2022)
was also examined. Media and frames: scratchpad `refs/track/`.

## Cutie — Putting the Object Back into Video Object Segmentation

Media: README / page demo MP4 (1280×720, 60 fps, 142 s), architecture JPG, GUI screenshot.

1. Frame: source footage at 100 % for the whole video. The only non-footage pixels are a
   ~130×40 px translucent slate-grey stamp top-left with one word (`Image`, `Mask`, `Overlay`,
   `Inset`, `Edited`, `Inpainted`) and three flat title slates totalling ~6 s of 142 s.
2. Input timing: slate 0–2 s; raw footage stamped `Image` for ~1.5 s; at ~3.5 s a diagonal wipe
   (~0.5 s) reveals `Mask` (solid silhouettes on black), holds ~1.5 s; a second wipe brings the
   overlay, which runs unlabelled 5–10 s. Later clips skip the raw stage.
3. Inference: not visualised. No progress state. The wipe is the only reveal; later the output is
   proven by consequence (a logo composited behind a dancer with correct occlusion, inpainting).
4. Overlays: per-object solid fill in the DAVIS palette, alpha 60–70 % (fur texture reads
   through), no outline, no box, no label or ID. Colours fixed per identity through occlusion.
5. Text: ≤ 1 word on screen, often zero.
6. Cards: none over footage; slates are full-frame interstitials.
7. Transitions: diagonal wipe between views of the same clip; hard cuts between clips.
   Comparisons happen in time, not space.
8. Architecture: never in the video; a static figure on the page.
9. Not a slide because: footage every second except three slates; the label is a stamp; the reveal
   is a wipe over the same footage; the editing section shows what the output enables.
10. Transfer: the three-state wipe on the same weld photo: `Photo` → `Defect` (silhouette on
    black) → `Overlay`, with a one-word stamp top-left.

Do not copy: the GUI screenshot (settings panel) and the flat blue-grey title slates.

## MASA — Matching Anything by Segmenting Anything

Media: 2-min teaser (1280×720, 24 fps, 128.5 s, with music), boxes-vs-masks split (1920×1080),
open-vocabulary clip, README GIFs, teaser figure.

1. Frame: footage at 100 % with thin boxes. The minions split is two 960×1080 halves of the same
   clip (boxes only | boxes + SAM masks), no gutter.
2. Input timing: cold open — frame 0 already carries boxes. The title arrives at ~4 s over the
   footage, holds ~4 s, dissolves into the next clip.
3. Inference: only its persistence: a box keeps its colour through occlusion and re-entry. One
   README GIF prints an `FPS: 11.4` counter.
4. Overlays: rectangles ~2 px at 720p, one colour per track ID, no fill; label = lowercase class
   in a small filled tag of the box's colour at the box top-left (12–14 px at 720p). Masks: flat
   fill in the box colour at ~50 %.
5. Text: one word per box; the title (two lines + a subline) and one on-footage caption
   ("Segmentation Tracking with SAM", white bold, centred, in and out within ~3.5 s).
6. Cards: none; text sits on footage with a soft shadow.
7. Transitions: hard cuts, ~5 s per clip (~22 clips); one dissolve out of the title; fade to an
   outro logo + QR code (~5 s).
8. Architecture: never in the video.
9. Not a slide because: trailer rhythm — cold open on results, the title arrives after the viewer
   has seen the model work, the only words are class names attached to objects.
10. Transfer: cold open on the result; the title superimposed on running footage and fading;
    the one-word tag in the box's own colour; the boxes-vs-masks split as a way to show two
    representations of one detection without a panel.

Do not copy: the logo + QR outro, the blurred-skyline title background, `car | 0.83 | ID` clutter.

## CoTracker (Meta) — It is Better to Track Together

Media: teaser (854×480, 10 fps, 5.7 s), grid and individual-point comparison strips
(4 panels wide), dense teaser, README teaser PNG and raw input sample.

1. Frame: teaser = footage edge to edge. Comparison videos = each panel padded with a white
   margin (`pad_value=120`) so tracks that leave the image are still drawn; the frame edge is
   not the data edge.
2. Input timing: frame 0 = raw footage with small dots on the rider (zero-length trails), so the
   first ~0.6 s reads as raw + query points; trails extend from ~0.8 s; by 2 s the ribbon dominates.
3. Inference: by accumulation — the trail grows frame by frame; the viewer watches the output
   being written. Occlusion = dots vanish and return. Quality = four identical clips side by side.
4. Overlays: 50–100 filled dots ~5–6 px; trails ~3 px, full length, alpha ~1; colour = rainbow by
   the point's initial vertical position; no outline, no labels. Grid mode on grayscale footage.
5. Text: zero words inside any video; method names are HTML headers above.
6. Cards: none; comparison = horizontal tiling with white gutters.
7. Transitions: none; clips loop.
8. Architecture: never, not even in README media.
9. Not a slide because: the whole frame is data being written; one colour rule means no legend;
   grayscale footage makes the overlay the only coloured thing.
10. Transfer: draw the process signal as a growing trail — ~3 px line, ~6 px dot at "now", full
    history, written across the frame as time advances, no axis box. Let a trace run past the
    photo's edge into a neutral margin rather than clipping it.

Do not copy: the dense rainbow carpet of the second teaser (obliterates the footage).

## OmniMotion — Tracking Everything Everywhere All at Once

Media: swing, horse, butterfly clips (864×480, 10–20 fps, 4–6 s), stacked pseudo-depth clip.

1. Frame: footage at 100 %; the pseudo-depth version stacks footage + tracks above the depth map,
   same size, no gutter, no titles.
2. Input timing: frame 0 already has ~40 dots on the foreground; trails visible from ~0.6 s.
3. Inference: accumulation; occluded points switch glyph from dot to "+"; the internal state
   (pseudo-depth) is a synchronised second image, not a diagram.
4. Overlays: filled dots 4–5 px; trails 1.5–2 px at ~70 %; jet colormap by initial position;
   when the swing reverses, the trails fan into an arc, so one frame encodes the whole history.
5. Text: zero; legend and the "+" convention are HTML text.
6. Cards: none; the depth view is an untitled stacked panel.
7. Transitions: none; clips loop.
8. Architecture: not in any clip.
9. Not a slide because: sparse foreground-only trails keep the footage legible; the internal
   representation is a moving image.
10. Transfer: foreground-only sampling (dots only on the toe); a glyph change instead of a
    number for uncertainty; one untitled same-size panel for one internal state.

Do not copy: a full-frame jet heatmap.

XMem (same author as Cutie): same grammar — one-word stamps, diagonal wipe, the source's own
captions do the narration; the demo adds no words.

## Cross-cutting patterns (video / tracking)

- The footage is the frame; margins exist only for a data reason.
- Input-first is brief or zero (Cutie 1.5 s; CoTracker / OmniMotion ~0.5 s; MASA 0 s).
- Inference is never drawn; persistence over time is the proof (same colour across frames, a
  trail that grows).
- One colour rule per clip, never a legend; a second attribute changes the glyph, not the colour.
- Words are stamps, not sentences (≤ 1 word, small translucent tag ~2–3 % of frame height).
- Transitions are cuts and wipes only; comparison = tiling identical clips.
- Architecture never appears in demo media.
- Output is proven by downstream use (a logo behind a dancer; boxes fed to SAM).
- Grayscale footage under a coloured overlay makes the model's output the only colour on screen.
