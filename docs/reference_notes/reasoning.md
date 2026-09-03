# Reference notes: reasoning / embodied / industrial demos

Studied 2026-09-02 from downloaded project-page media (frames viewed on timestamped contact
sheets). Media and frames: scratchpad `refs/reason/`.

Negative findings first: RT-2's chain-of-thought clip draws no reasoning at all (robot footage
at 2× plus an "Instruction:" caption); PaLM-E's teaser is four video quadrants around a logo
with typed "Task / Next step" text — the definition of an animated dashboard. AnomalyGPT's video
is offline; only its chat screenshots exist.

## ReKep (CoRL 2024) — reasoning drawn on the scene

Media: teaser MP4 (130 s, 1280×720), pour-tea split (29 s, 3840×1080).

1. Frame: the scene itself — real dual-arm footage full frame (a small "4X" top-right), then the
   same scene as a point cloud. The model never occupies the centre.
2. Input timing: 0 s is the scene; the task name is a small grey label top-left.
3. Inference: the scene darkens; a stroked circle "Large Vision Model" appears at the right; the
   teapot and cup are tinted directly; white arcs from the circle point to coloured keypoints on
   the objects; then a "Vision Language Model" circle with "</> Code </>" below; a black line is
   drawn between the gripper keypoint and the handle keypoint with one word beside it, "Grasp".
   A constraint is a line plus a word, drawn on the data.
4. Overlays: keypoints = small coloured diamonds / dots on the real objects; constraints =
   segments or L-shaped polylines ("Align", "Pour"); the plan = a fan of gripper poses.
5. Text: ≤ 1 label + 1 word at any time; one white title card (~3 s).
6. Cards: yes, but only to accumulate completed steps: rounded thumbnails "ReKep 1/2/3" top-left,
   each holding that step's annotated point cloud; at the end they flow into one box
   "Constrained Optimization" for 5 s, then vanish.
7. Transitions: footage darkens → dissolves to the point cloud of the same view → camera pushes
   in → white → back to footage. One continuous scene, no page changes.
8. Architecture: only the 5 s "three thumbnails → one box" recap after the steps have been seen.
9. Not a slide because: almost no words; every concept is a geometric mark on an object; truth
   labels ("4X", "Closed-Loop Replanning at 10 Hz"); a human pushes the teapot mid-clip and the
   trajectory replans on screen without a caption.
10. Transfer: hypothesis → evidence → verdict as ReKep lines: each hypothesis is a line from the
    toe groove on the photo to the marked segment of a signal channel, one word on the line;
    the check is the line flashing, then solid (supported) or dashed and fading (refuted); the
    surviving line is the conclusion. Each result collapses into a small thumbnail; the
    thumbnails become the ranking.

Do not copy: the 3×3 task grid at the end (showreel).

## VoxPoser (CoRL 2023) — the model's belief painted onto the scene

Media: teaser MP4 (50 s, 1440×1080), sort-trash clip (13 s).

1. Frame: a coloured point cloud (drawer, vase, robot) fills the frame; the models are two
   stroked hollow circles "Large Language Model" / "Visual Language Model" below the scene.
2. Input timing: at 2 s a chat bubble with the instruction; afterwards the instruction is split
   into short fragments shown as one white line top-left.
3. Inference: a line grows out of the LLM circle with "</> Code </>" under it; a white rectangle
   appears on the drawer handle inside the 3D scene; the whole scene is tinted with a smooth
   value map (blue near the target, red near the vase); the LLM circle becomes a spinning ring
   while "thinking"; an orange dotted trajectory is drawn through the colour field, labelled
   "Motion Planning".
4. Overlays: detection = white box on the object; belief / cost = volumetric colour field over
   the scene; trajectory = orange dotted line.
5. Text: one instruction fragment + two model names, ≤ 3 phrases.
6. Cards: none except the opening chat bubble and the closing task grid.
7. Transitions: camera moves inside the same point cloud; white fade; cut to the real robot.
8. Architecture: never as a block diagram; two circles and a growing code line are all of it.
9. Not a slide because: the colour field changes continuously; "thinking" is a spinning ring on
   the circle, not a word.
10. Transfer: the fast layer's output as VoxPoser tinting — a heat band along the weld toe; a
    translucent band over the unstable interval of a signal; normal channels untouched.

Do not copy: the avatar chat bubble; the closing task grid.

## ViperGPT (ICCV 2023) — step-by-step reasoning that is not a slide deck

Media: teaser (24 s, 2160×840), pizza example (12 s), method video (105 s).

1. Frame: white (teaser) or black (examples); the subject is intermediate results cropped out
   of the input image: a row of eight muffin crops, two child crops, a number "n_muffins = 8".
   The code card is under a quarter of the frame at the left.
2. Input timing: the question is one line at the top with the input photo large in the centre;
   at 5 s the photo shrinks to a thumbnail at the left and stays there.
3. Inference: code types in line by line; during execution the current line is covered by a cyan
   highlight bar (it even extends past the card's edge) while the right column shows that line's
   product: `find("muffin")` → a cyan box on each muffin in the grayscale image;
   `len(...)` → "n_muffins = 8" plus eight crops in a row; the last line → "result = 8/2 = 4"
   in large type.
4. Overlays: boxes on the grayscale original; crops pulled out into a strip; numbers in large
   monospace.
5. Text: one question line + one small code card + one result label. The code is visibly
   "there is code", not "read this code".
6. Cards: one fixed dark code card; results are placed directly on the empty ground.
7. Transitions: no page changes; a fixed layout where elements appear in place; the photo's
   shrink to the left is the only move.
8. Architecture: only in the separate method video.
9. Not a slide because: every reasoning step corresponds to a product grown from the data
   (box, crop, number); the viewer watches a program execute on the image.
10. Transfer: a knowledge-graph rule as a three-line card; clauses highlight one by one; each
    highlight crops the evidence out of the data and prints the substituted value
    (`279 A ∉ [119, 182] A ✓`); the last line is the verdict. Small rule card, large crops.

Do not copy: the all-black hacker-terminal look of the pizza example.

## YAY Robot (RSS 2024) — human feedback without a UI

Media: demo MP4 (179 s, 1280×720), teaser (28 s, schematic animation).

1. Frame: dual-arm ALOHA footage full frame.
2. Input timing: the task name is one orange line over the footage for 2–3 s.
3. Inference: a bottom-left caption bar alternating two colours: green "prediction: move the
   scoop into the bag" (the model's current instruction) and orange "user: i want more
   cranberries" (a human interrupting). Colours alternate six times in 18 s.
4. Overlays: no boxes, masks or trajectories; the caption bar, a bottom-right
   "Autonomous | 1X / 5X" speed tag, a small webcam picture-in-picture of the speaker.
5. Text: one caption + one speed tag + a logo corner.
6. Cards: none in the footage. The teaser uses a pink band of timestamped robot-view thumbnails,
   a red X on failures, a strike-through on the old instruction with the new one in magenta,
   then a small pipeline row and a success-rate line chart.
7. Transitions: hard cuts between footage segments.
8. Architecture: only the last 5 s of the teaser: three icons and one chart.
9. Not a slide because: the human is actually in frame; the robot actually moves; the caption
   colour is the entire semantics of "who is speaking"; "After post-training" is one blue line
   followed by the robot completing the task.
10. Transfer: a human receiving a recommendation without a UI mock-up: real footage, a caption
    bar whose colour says who is speaking, a truth tag ("Closed-loop | 1X"); the old parameter
    struck through and the new one written over it.

Do not copy: the pink band with database / network icons.

## DriveVLM (CoRL 2024) — slow VLM + fast pipeline in a real car

Media: YouTube video (270 s, viewed at 640×360), qualitative PNGs.

1. Frame: the driver's-seat view fills the frame.
2. Input timing: immediate — the windscreen is the input; a 3×3 scene mosaic at 8 s as a menu.
3. Inference: the slow layer's output is a fixed top-right panel with a small camera thumbnail
   and 6–8 structured fields in two languages; the fast layer's effect is drawn on the
   instrument cluster — a red ring around the speedometer while the number drops from 40 to 32;
   a bottom caption gives the decision in plain words.
4. Overlays: the red ring on the gauge; the panel thumbnail; white scene banners with bullets.
5. Text: too much — panel fields, bottom caption and a centred note at once; the most
   dashboard-like reference.
6. Cards: a fixed output panel plus scene banners.
7. Transitions: hard cuts to new road segments; banners slide in.
8. Architecture: never; the fast/slow split is shown as cause and effect (decision text → gauge).
9. Not a slide because: real car, real road, real gauge readings changing after the decision.
10. Transfer: when the slow layer concludes, immediately ring the quantity it changes on the
    data (the current level against its window), and let the next trace move into the ring.

Do not copy: the bilingual panel, the scene banners, the 3×3 menu.

## AnomalyGPT (AAAI 2024) — the usual industrial-inspection VLM page (mostly a counter-example)

Media: five chat screenshots and an architecture PNG.

1. Frame: a chat transcript with avatars in a large serif face.
2. Input timing: the user's first message is a small crack photo.
3. Inference: three question–answer rounds; the reasoning is sentences.
4. Overlays: a small black square beside the answer with a white blurred band at the crack
   (an anomaly map); a defect-free image gets an all-black square. The map is not overlaid.
5. Text: the whole page.
6. Cards: the whole page is one chat panel.
7–8. Static; a separate architecture PNG. Anomaly-OV (2025) shows only an architecture figure.
9. Not a slide: it is not distinguishable; this is what WELDER must avoid.
10. Transfer: only "all black = no anomaly" (normal channels stay untinted) and "overlay the map
    on the image, never beside it".

Do not copy: the chat transcript form.

Short additions: Hume (2025, System-2 VLA) shows the slow layer as a schematic — candidate
paths fan out, one magenta path is selected; pass / fail in footage is a floating badge
(red X "Failure" → green tick "Recover"). VisProg's "visual rationale" ledger substitutes the
actual values into the expression (`'2 + 1 >= 3?'`) — worth borrowing.

## Cross-cutting patterns (reasoning / embodied / industrial)

- Data / scene ≥ 80 % of the frame; the model appears only as a stroked circle with a name or a
  small code card in a corner, never as a centred block diagram.
- Input appears within 0–2 s and is never introduced again; the question shrinks to one line.
- Reasoning = a geometric mark on the data + one word per mark. Budget: ≤ 1 sentence + ≤ 3
  labels at any time; more than that reads as a dashboard.
- Step-by-step reasoning = one highlight ↔ one product grown from the data; finished steps
  accumulate as small thumbnails in a corner and are summarised only at the end.
- Transitions are continuous camera moves inside one scene (darken → point cloud → push in →
  white → back); at most one title card, ~3 s, white ground.
- Architecture at most once, at the end, ≤ 5 s, as a recap of what was just seen.
- Human interaction = caption colour + speed tag + optional speaker picture-in-picture, no UI.
- First and last shots are real footage with no overlay.
