# Reference notes: project-page hero conventions

Studied 2026-09-02: 14 clips and 3 static heroes downloaded from CVPR / ICCV / NeurIPS project
pages, frame-extracted and viewed. Media and frames: scratchpad `refs/pages/`.
`segment-anything.com` did not resolve from this machine; Meta's SAM 2 page was used instead.
The MASt3R publication page has no hero video.

## Nerfies (the canonical project-page template)

Teaser MP4 1920×768 (2.5:1), 19.9 s, autoplay muted loop without controls, flush under the
button row, followed by one sentence. Four portrait panels butted edge to edge (capture, input,
Nerfie, depth) fill ~88 % of the height; a white caption strip takes the bottom 12 % with nine
words at ~5 % cap height. All panels run from 0 s; inference is implied by synchrony. Zero cuts;
no architecture. Transfer: synchronized strip plus a fixed caption strip; the page rule
"title → buttons → silent loop → one sentence".

## LERF

Teaser 1920×1080, 33 s. A NeRF fly-through fills the frame; a dark rounded search bar bottom-centre.
Raw render 0–2 s, a query types letter by letter (~1 s), the scene desaturates to grey and the
matching object glows with a heatmap while the camera pushes in for 2–3 s; colour returns. ≤ 2
words at a time (~5 % cap height in the bar). Hard cuts between three scenes. Transfer: query →
desaturate → highlight → push in; only the supporting evidence stays in colour. Do not copy the
search-box widget.

## Instant-NGP

Teaser 2048×512 (4:1), 10 s. Four square tiles edge to edge; each output converges from blur
to sharp in place while a counter top-right reads "Elapsed training time: 0 → 9 seconds". Five
words at ~5 % cap height. Zero cuts; the loop restarts from blur. Transfer: output forming in
place with time as the proof.

## DINOv2

Hero 1732×784, 27 s, used as a page background. Four portrait panels: raw dog video, PCA of
patch features on black, depth, semantic fills. All synchronized from 0 s; zero words inside the
video; zero cuts. Do not copy: dimming the footage behind a headline.

## DUSt3R (CVPR 2024)

Page order: H1 → supplementary video with controls (1280×720, 127 s, not autoplay) → abstract →
a 15 s GIF (four rows of input | input | rotating point cloud). The video is a narrated deck:
title card 0–5 s, first input at 6 s, a "Method" slide at 14 s with a grey rounded "Forward
pass" box, ~12 words per slide, hard cuts every 5–10 s. Transfer: the GIF's discipline (same
three-column grammar over four scenes, output always moving). Do not copy: the Method slide and
the author title card — the PowerPoint failure mode.

## 3D Gaussian Splatting

Hero = carousel of raw viewer recordings (1920×1080, 60 fps, 10–18 s) with the viewer's own
chrome (menu bar, a "60.00 (16.67 ms) VSync On" HUD). No input is shown; rendering is on screen
at 0 s. The narrated video (304 s) has a 10 s logo title card, a block diagram at 24 s with a
red highlight stepping through stages, and vertical split comparisons. Transfer: a live latency
HUD as proof of speed; the vertical split line. Do not copy: the title card and the block diagram.

## Depth Anything V1 / V2

V1 hero = static teaser PNG; videos are 2992×576 (5.2:1) triplets "Raw | MiDaS | Ours",
synchronized from 0 s, seven words above the panels at ~4 %, no cuts. V2 preview: 3×3 grids under
a red italic heading, hard cuts every ~7 s, 2-word tags at 1.7 % (illegible). Transfer: a fixed
comparison slot (baseline middle, ours right) and one fine-detail hero example. Do not copy: the
grid montage with decorative heading.

## Marigold (CVPR 2024 oral)

No video. Hero = collage (photos, depth maps, 3D views with red arrows), zero words in the image;
the gallery uses drag sliders (input ↔ ours). Transfer: the slider wipe for photo → defect map;
"arrow into a consequence".

## SAM 2 (substitute for segment-anything.com)

Hero clip 1080×1080, 13 s: raw campfire footage; after ~2 s flat translucent fills (teal, yellow,
blue) with 1 px outlines appear on kettle, cup and hand and stay attached through occlusion.
Zero words. One hard cut (raw → annotated), then continuous. Architecture only in a separate
32 s design clip. Do not copy: the "BIRD" kinetic typography and the animated block diagram.

## VGGT (CVPR 2025 best paper) — teaser A

Teaser 1440×720, 123 s, autoplay. White canvas: a small input thumbnail (~20 % of height) under
"32 Views" flips through the inputs for ~4 s; a pale-blue arrow labelled "0.51 s"; a large point
cloud pops in and orbits. Four words at ~5 % cap height, no title card. Hard cuts every ~20 s
between cases with only the numbers changing. Transfer: input thumbnail → time-labelled arrow →
large output, repeated over cases.

## MegaSaM (CVPR 2025 honorable mention) — teaser B

YouTube 1280×720, 310 s, narrated. Title card ~45 words for 10 s; then the input clip centred;
then the input shrinks to a bottom-left thumbnail (~1 s move) while the 3D output takes the
centre; dashed 2×2 comparison grids later; architecture after 1:30. Transfer: input shrinks to a
corner when the output takes over — a natural hand-off. Do not copy: the title card.

## Page-level conventions

- Background: the page is white on every academic page; inside the video the most common ground
  is the footage itself filling the frame, then a white canvas with floating elements. Black
  appears only under point clouds.
- Length and aspect: silent autoplay heroes run 10–35 s; multi-panel strips are very wide
  (2.2:1 to 5.4:1); narrated paper videos are 2–5 min at 16:9.
- Title card: none in any autoplay loop; narrated videos carry 5–10 s cards. No loop ends on a
  logo.
- Input → output: side-by-side synchronized panels most often; overlay for anything spatial on
  the input (masks, trails, heatmaps); slider wipes live on the page, not in the video;
  convergence in place (Instant-NGP) is the most "watch the model work".

## Cross-cutting patterns (project pages)

- The output is on screen at 0 s or within ~3 s; loops never build up to the answer.
- Word budget in loops ≤ 10 words (Nerfies 9, Depth Anything 7, Instant-NGP 5, VGGT 4, LERF 2,
  DINOv2 / SAM 2 / CoTracker 0). The page carries the sentence; the video carries the evidence.
- Panels are butted photos with thin gutters, never rounded cards with shadows.
- Text is sans-serif, black on white or white in a dark bar, cap height 4–5 % of frame height,
  in a strip above / below the panels or in a corner, never mid-frame.
- Time is the proof: counters and live HUDs; nobody writes "fast".
- Something is always in motion; text is static; builds happen by hard cut.
- Shot length 6–20 s with hard cuts; crossfades only in product / architecture clips.
- Architecture never appears in an autoplay hero.

Things the references say to avoid: title / author cards, labelled "forward pass" boxes and block
diagrams, grid montages with decorative headings, kinetic typography on gradients, dimming the
evidence behind a headline.
