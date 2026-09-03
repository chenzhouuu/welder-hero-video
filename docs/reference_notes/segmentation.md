# Reference notes: detection / segmentation demos

Studied 2026-09-02 from downloaded demo media (frames extracted with ffmpeg and viewed).
Media and frames: scratchpad `refs/seg/` (not kept in the repository).

## Grounded SAM 2 (IDEA-Research) and Grounded-Segment-Anything

Media: README intro MP4 (1280×720, 30 fps, 23.8 s), hippo / car tracking MP4s, pipeline PNG,
predecessor teaser PNG and Gradio chatbot recording.

1. Frame: wildlife footage at 100 % bleed for all 24 s. 0–3.1 s one clip; 3.1–14.3 s three 2×2
   grids of full-bleed cells; then three single clips. No margins, no background ever visible.
2. Input timing: no raw-first phase. Frame 1 fades up from black with boxes, masks and labels present.
3. Inference: not shown as a process; outputs are simply present and track. The only reveal is
   the title typing on ("Grou" 0.17 s → "Grounded SAM 2" 0.5 s) over the working footage.
4. Overlays: one saturated hue per instance. Mask = flat fill 50–60 %; box = 2 px solid same hue;
   label = solid chip of the same hue, white lowercase, outside and above the box's top-left,
   flush with the left edge (~14 px text at 1280 wide; in the grids 12 px and illegible).
5. Text: title one line (~36 px, no plate) for 3 s + label chips; last 1.5 s a URL. Never a sentence.
6. Cards / panels: none in any video.
7. Transitions: hard cuts only (checked at 30 fps: no dissolve frames), grids change every ~3.5 s.
8. Architecture: never in the video; a README PNG with the real photo between three blocks.
9. Not a slide because: every pixel is video, overlays move with objects, the title is typed
   onto footage, there is not one bullet, arrow or caption.
10. Transfer: the chip-above-box rule (2 px box in hue H, fill H at ~55 %, solid chip of H with
    one lowercase word in white). For WELDER at 1080p the chip text must be 24–28 px.

Do not copy: the 30-penguin frame, 12 px grid chips, the Gradio recording where the image is
13 % × 20 % of the frame surrounded by controls (the animated-dashboard failure).

## SAM 2 (Meta) — project page hero and section clips

Media: hero MP4 (1920×1080, 24 fps, 13.2 s), "select objects" square clip, effects clip,
"SAM 2 design" clip (32.6 s), SA-V dataset clip.

1. Frame: hero = dark navy-to-teal ground with floating rounded video cards; the in-focus card is
   sharp, ~770×430 px (≈40 % of width), peripheral cards blurred 10–15 px and dimmed ~50 %.
   Section clips = 100 % bleed footage.
2. Input timing: raw footage ~0.55 s; a translucent white cursor disc (~30 px) lands; mask fill
   begins at ~0.8 s.
3. Inference: click → mask. The fill fades in over 6–8 frames at 24 fps (~0.3 s) with a 1–2 px
   outline; a white disc with a green "+" persists 1–1.5 s then fades; a red "−" shows a
   negative click. Masks persist and track through occlusion.
4. Overlays: flat single-hue fills at 60–70 % with a lighter 1–2 px outline. No labels, boxes or
   text in any clip.
5. Text: zero inside hero and section clips. The design clip has a title (~40 px) and block
   labels (~22 px), ≤ 12 words on screen.
6. Cards: only the hero's video cards, and each card *is* footage. Design clip: white / pale-blue
   rounded blocks on a #EEF2F7-like ground, no shadows.
7. Transitions: hero = continuous 3D dolly (~1.2 s): outgoing card scales up and exits right while
   the next rises from lower-left, scaling from 40 % and sharpening. Focus changes every ~3 s.
8. Architecture: its own 32 s clip after the demo; builds one element per ~1 s; the real
   input/output thumbnails keep playing inside the diagram.
9. Not a slide because: the camera never stops, nothing is a static composition, no words.
10. Transfer: the click-to-mask cadence (raw 0.5–0.8 s → 30 px marker → 0.3 s fill at ~60 % with
    2 px outline → marker lingers 1–1.5 s → mask stays), and "architecture only after the demo,
    one element per second, real thumbnails embedded".

Do not copy: the effects reel (gradient-mapped mask, sunburst background) and floating cards
holding anything other than real data.

## Grounding DINO (IDEA-Research)

Media: only static PNGs (hero figure 2591×1439, architecture, GLIGEN figure).

1. Frame: a paper figure: 2×3 grid of photos (~17 % of width each) with tinted header chips,
   captions under every image, a two-line figure caption. Photos are ~45 % of the figure.
2. Input timing: n/a; the raw image is never shown alone.
3. Inference: the prompt sits as a caption under each image; the reader infers prompt → boxes.
4. Overlays: 2 px boxes in per-instance colours, ~10 px labels in the box colour (unreadable).
5. Text: ~90 words on one figure.
6. Cards: tinted header chips and grey caption plates — the slide vocabulary.
7. Transitions: none; arrows between panels.
8. Architecture: dense block diagram with the input photo at the bottom.
9. Not a slide: it is a figure. One strong trait: the prompt text sits directly under the image
   it produced.
10. Transfer: "one box, one phrase" — a single box for a single phrase, the phrase immediately
    under the image in ~26 px.

Do not copy: tinted header chips, grey caption plates, the multi-column captioned grid.

## SEEM — Segment Everything Everywhere All at Once (NeurIPS 2023)

Media: README GIFs (600×338, 10 fps: dog 15 s, ballet 5 s; two NeRF orbits), prompt-type figures.

1. Frame: 100 % bleed footage in every GIF.
2. Input timing: mask present from frame 1; it persists across the source film's own cuts.
3. Inference: not shown in GIFs. Static figures: a green dot (~20 px) or a thick green scribble
   on the object, or a typed phrase, then a thin arrow to the masked image.
4. Overlays: one flat fill per object at 75–80 % (detail almost hidden), no outline, no box.
   Label = lowercase class or the typed phrase in white ~13 px on a solid black chip at the mask
   centroid, moving with it.
5. Text: one word per object.
6. Cards: none in GIFs; before → after pairs in figures.
7. Transitions: hard cuts inherited from the source; the overlay persisting across them is the
   demonstration of tracking.
8. Architecture: static README PNG only.
9. Not a slide because: footage plus a single moving word; the label follows the object so it
   reads as a property of the thing.
10. Transfer: centroid-anchored label that travels with the region and can be the prompt phrase
    itself; "prompt as a dot / scribble on the evidence" for signal segments.

Do not copy: 80 % mask opacity on a weld (the groove texture is the evidence; keep ≤ 60 %); the
nine-column captioned teaser strip.

## Cross-cutting patterns (detection / segmentation)

- The footage is the frame: 100 % bleed, or a large sharp card of footage on a plain dark ground.
- The narrative is prompt → prediction, nothing else; raw footage precedes it by ≤ 0.6 s.
- One hue carries one instance across box, mask and chip; fill 50–70 %, outline 1–2 px, chip solid
  with white lowercase text; labels are one word.
- Text budget 0–1 line. Paragraphs live in the HTML around the video.
- Transitions are hard cuts or one continuous camera move; nobody crossfades between compositions.
- Breadth is shown by tiling footage (2×2 grids), never by listing.
- Architecture is quarantined: a static PNG or its own build-up clip after the demo.
- The same repos contain the anti-patterns: Gradio recordings, effects reels, captioned grids.
