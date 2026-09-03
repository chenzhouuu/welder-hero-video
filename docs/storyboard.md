# WELDER hero video — storyboard v3 (one weld through the system)

Status: **interactive storyboard for the story / composition / meaning review. Nothing rendered;
timing is provisional.** The video is one continuous timeline (88 s) in `src/story/`; the
storyboard page shows it through the same `SceneHost` the render will use.

Review with `http://<host>:8094/?director=1` — chapter buttons 1–9 seek along the one
timeline; the scrubber covers the whole story; keyframe buttons jump to the review frames;
`[` `]` step chapters, `←` `→` step frames, `n` notes, `g` guides. Direct link to a second:
`?director=1&t=56.5`. `http://<host>:8094/` plays the whole story with plain controls.

## The story

One weld — the real undercut weld `03-15-23-0080-05`, called *Weld 087* on screen — moves
through the proposed system without ever leaving the frame:

| # | t (s) | chapter | what persists | what happens to it |
|---|---|---|---|---|
| 1 | 0–12 | The weld | arc footage (full bleed), three traces writing underneath, the weld's ID, a log clock | the physical event produces the digital trace |
| 2 | 12–21 | Fast process monitoring | footage pulled to the top-left; the same traces, larger, on white | a sliding window trails the write head and leaves ticks; three earlier welds (real logs) pass the same check at the top right; when the arc goes out: **process nominal** |
| 3 | 21–33 | Post-weld visual inference | the real front photo, full bleed; the current trace stays as a thin strip at the bottom with its finding | raw image → SAM 3.1 bead box with score → bead mask → push-in → marker → defect region → **undercut** |
| 4 | 33–41 | Fast QC · disagreement | photo shrinks to a band, the trace rises under it; both findings stay on their evidence | a line joins the region to the plateau: **disagreement** · product abnormal · process nominal |
| 5 | 41–58 | Neural-symbolic reasoning | same photo band, same trace; the band between them becomes the reasoning space | three kb-v1 mechanisms are tested one by one: mechanism / expects / observed / verdict, each with a line to the evidence it is tested on |
| 6 | 58–64 | Root-cause hypothesis | same | the graph collapses: *likely mechanism* torch angle / travel (lines to the groove and the steady plateau); *also consistent* heat input; arc instability gone; the diagnosis becomes one record line |
| 7 | 64–73 | Manufacturing memory | the photo becomes a thumbnail; the record line becomes its label | the thumbnail joins the operator's earlier welds (real photos); the undercut ones lift out and gather; their stored mechanism marks converge: **recurring pattern** |
| 8 | 73–81 | Welder training | hard cut | schematic morphs observed → recommended practice (work angle, travel); defect weld → target weld (real photos); **targeted welder training** |
| 9 | 81–88 | Enterprise fast/slow loop | hard cut | new welds stream through the fast check; one disagrees and drops into the reasoning lane; *fast for all · deep reasoning when needed*; the name |

Hard cuts: 21 s (footage → photo), 73 s, 81 s. Everything else is a camera move on the same
objects (`src/story/layout.ts` holds every track).

## Review keyframes

`?director=1&t=…`: 7.5 live welding + signals · 18 fast process inference · 26.5 bead
grounding + mask · 31.5 undercut · 39.5 disagreement · 56.5 hypothesis reasoning · 62 likely
mechanism · 71.5 operator pattern · 79.5 training · 84.5 enterprise loop.

## What is real, what is intended, what is illustrative

Every element is tagged in `src/data/provenance.json`. The short version:

- **Real data**: the arc footage, the six-channel log, the front photo (label removed by the
  project pipeline), the three good welds' logs in chapter 2, the four other welds' photos in
  chapter 7, the good weld's photo in chapter 8. Nothing on screen is synthetic footage.
- **Real model outputs**: the bead box and score (SAM 3.1, prompt "a weld bead", 0.74) and the
  bead mask; the fast process findings (`current STEADY`, `arc_stability NOMINAL`,
  `process_integrity NOMINAL`) are the project's deterministic TS analyzer output for this weld
  (`docs/ts_03-15-23-0080-05.json`), shown as the words *process nominal*.
- **Knowledge**: the three mechanisms are kb-v1 cause edges into UNDERCUT (INCORRECT GUN
  ANGLE w9 / TRAVEL SPEED TOO FAST w9; WELDING CURRENT w8 / EXCESSIVE VOLTAGE w9); kb-v1 has no
  ARC INSTABILITY → UNDERCUT edge, which is why that hypothesis is the one the evidence weakens.
  The 119–182 A window is p5–p95 of 140 good fillet Fe410 welds.
- **Intended system behaviour**: the verdicts (weakened / consistent), the ranking in chapter 6,
  the record, the stored mechanism marks on the earlier undercut welds, the recurring-pattern
  aggregation, the training recommendation, the routing in chapter 9.
- **Illustrative**: the undercut band (it follows the real lower edge of the SAM mask, but no
  defect-segmentation output exists; extent and thickness are drawn), the IDs Weld 043–092 and
  Operator W017 (the dataset has no operator or weld-number fields), the torch schematic
  (textbook geometry; no torch-angle or travel sensor exists).

### The one place the data pushes back

Every undercut weld in the dataset was welded at 241–312 A; the good fillet welds sit at
119–182 A. So for this weld the fast monitor's *process nominal* is true in the sense the
monitor measures — stability, dropouts, transients (its actual output) — and the current
setpoint is nevertheless outside the qualified window. The storyboard handles this by (a)
letting the fast monitor say only what it measures, (b) keeping heat input in the reasoning as
a third mechanism that stays *consistent* rather than hiding it, and (c) letting the
operator's history — not the single case — be what elevates torch / travel to the recurring
pattern that drives training. The video never states that the current was inside the window.
Whether heat input should appear at all in chapter 5–6 is the first review question.

## Questions for the review

1. Chapter 5–6: keep heat input as the third mechanism (honest to kb-v1 and the data) or drop
   to two mechanisms (arc instability weakened, torch / travel consistent) and carry the setpoint
   only in the record?
2. Chapter 2: three earlier welds passing at the top right — enough to say "every weld", or
   should the ticker be longer / faster?
3. Chapter 3: the CV progression labels bottom-left (raw image / bead grounding / bead
   segmentation / defect region) — keep as words, or let the overlays speak alone?
4. Chapter 4: the wording *product abnormal · process nominal* under *disagreement*.
5. Chapter 7: the operator label and "earlier welds, same station"; the gathered undercut
   welds at 1.25× — enough emphasis?
6. Chapter 8: the schematic (work angle 28° → 45°, travel regular) — acceptable as an
   illustrative coaching visual, or should the angle numbers go?
7. Chapter 9: loop welds carry small real photos; the divert of Weld 090 — clear enough?
8. Overall length (88 s) and footage speed (1.4× real time in chapters 1–2).

## Render notes (for later)

- Both hosts share `SceneHost`; `npx remotion still src/index.ts story out/f.jpg --frame=1695`
  matches `?director=1&t=56.5` pixel for pixel.
- The arc footage is `<Video>` (not `<OffthreadVideo>`): the compositor binary needs glibc ≥ 2.35
  and this host has 2.31. It is addressed by log time (`src/data/hero.ts`).
- The SAM mask PNGs are binary (2 KB); the ring is an SVG dilate filter, computed at render time.
