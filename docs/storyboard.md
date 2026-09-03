# WELDER hero video — storyboard v3.1 (one weld through the system)

Status: **interactive storyboard for the story / composition / meaning review. Nothing rendered;
timing is provisional.** The video is one continuous timeline (90 s) in `src/story/`; the
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
| 2 | 12–21 | Fast process monitoring | footage pulled to the top-left; the same traces, larger, on white | a sliding window trails the write head and leaves ticks; a production stream of eight earlier welds (real logs) scrolls through the same check at the top right; when the arc goes out: **process stable** |
| 3 | 21–32 | Post-weld visual inference | the real front photo, full bleed; the current trace stays as a thin strip at the bottom with its finding | raw image → SAM 3.1 bead box with score → bead mask → push-in → marker → defect region → **undercut**; no step words |
| 4 | 32–39 | Fast QC · disagreement | photo shrinks to a band; the current and voltage traces rise under it; both findings stay on their evidence | a line joins the region to the stable plateau: **disagreement** |
| 5 | 39–56 | Neural-symbolic reasoning | same photo band, same traces; the band between them is the reasoning space | knowledge fans out from the finding to three mechanisms (kb-v1); each sends an edge back into the evidence it predicts: arc instability → the stable I/V plateaus → *weakened*; heat input → the qualified window under the plateau (*stable ≠ optimal*) → *plausible*; torch / travel → the toe groove, compatible with the stable traces → *likely* |
| 6 | 56–61 | Root-cause hypothesis | same | the graph collapses: *likely mechanism* torch / travel; *also consistent* heat input; arc instability gone; the diagnosis becomes one record line |
| 7 | 61–72 | Manufacturing memory | the photo becomes a thumbnail; the record line becomes its label | the thumbnail takes the last slot of the operator's eight recent welds (real photos, 4×2); the undercut cases lift into a row of their own, the good ones sink; each undercut case shows its stored mechanism mark; the marks converge: **recurring pattern** |
| 8 | 72–82 | Welder training | the pattern words | photos go; *recurring pattern* becomes *training focus · torch / travel consistency*; then observed vs recommended practice (qualitative schematic, no angle values) and defect weld vs target weld (real photos); *targeted welder training · inspection becomes feedback* |
| 9 | 82–90 | Enterprise fast/slow loop | hard cut | eight new welds stream through the fast check; Weld 090 disagrees, drops into the reasoning lane and dwells there while the fast lane keeps flowing; *fast screening for all welds · deep reasoning only when needed*; the name |

Hard cuts: 21 s (footage → photo) and 82 s (training → loop). Everything else is a camera move
on the same objects (`src/story/layout.ts` holds every track).

## Review keyframes

`?director=1&t=…`: 7.5 live welding + signals · 17.5 fast process inference · 25.5 bead
grounding + mask · 30.5 undercut · 37.5 disagreement · 45 arc instability weakened · 50 heat
input plausible · 55 torch / travel likely · 59 likely mechanism · 64.5 operator history ·
70.5 recurring pattern · 79.5 training · 86 enterprise loop.

## Wording

- The fast process finding is **process stable**: the monitor measures stability, transients,
  dropouts and integrity (`docs/ts_03-15-23-0080-05.json`), not whether the setpoint is inside
  every qualified window. *Stable ≠ optimal* is written once, in chapter 5, where heat input is
  tested against the qualified window.
- Verdicts: *weakened* / *plausible* / *likely*; chapter 6 uses *likely mechanism* and *also
  consistent*. No "root cause", no "definitive".

## What is real, what is intended, what is illustrative

Every element is tagged in `src/data/provenance.json`. The short version:

- **Real data**: the arc footage, the six-channel log, the front photo (label removed by the
  project pipeline), the eight good welds' logs in chapter 2, the seven other welds' photos in
  chapter 7 (three undercut, four good, same two sessions), the good weld's photo in chapter 8.
  Nothing on screen is synthetic footage.
- **Real model outputs**: the bead box and score (SAM 3.1, prompt "a weld bead", 0.74) and the
  bead mask; the fast process findings (`current STEADY`, `arc_stability NOMINAL`,
  `process_integrity NOMINAL`) are the project's deterministic TS analyzer output for this weld
  (`docs/ts_03-15-23-0080-05.json`), shown as the words *process stable*.
- **Knowledge**: the three mechanisms are kb-v1 cause edges into UNDERCUT (INCORRECT GUN
  ANGLE w9 / TRAVEL SPEED TOO FAST w9; WELDING CURRENT w8 / EXCESSIVE VOLTAGE w9); kb-v1 has no
  ARC INSTABILITY → UNDERCUT edge, which is why that hypothesis is the one the evidence weakens.
  The 119–182 A window is p5–p95 of 140 good fillet Fe410 welds.
- **Intended system behaviour**: the verdicts (weakened / consistent), the ranking in chapter 6,
  the record, the stored mechanism marks on the earlier undercut welds, the recurring-pattern
  aggregation, the training focus, the routing in chapter 9.
- **Illustrative**: the undercut band (it follows the real lower edge of the SAM mask, but no
  defect-segmentation output exists; extent and thickness are drawn), the IDs Weld 043–095 and
  Operator W017 (the dataset has no operator or weld-number fields), the torch schematic
  (qualitative textbook geometry, no values; no torch-angle or travel sensor exists).

### The one place the data pushes back

Every undercut weld in the dataset was welded at 241–312 A; the good fillet welds sit at
119–182 A. So the fast monitor's *process stable* is true in the sense the monitor measures,
and the current setpoint is nevertheless outside the qualified window. The storyboard keeps
both facts on screen: the fast path says only what it measures; heat input stays in the
reasoning as a *plausible / also consistent* mechanism, tested against the window; and the
operator's history — not the single case — is what elevates torch / travel to the recurring
pattern that drives training. The video never states that the current was inside the window
and never names a definitive cause.

## Questions for the review

1. Chapter 5: the edge words (*expects erratic I / V*, *expects level above qualified window*,
   *expects one-sided toe groove*, *compatible with stable I / V*) — keep as the visible symbolic
   relations, or drop to verdict words only?
2. Chapter 5: *stable ≠ optimal* written once at the heat-input test — keep?
3. Chapter 7: eight welds in a 4×2 grid, four undercut lifting out — enough emphasis, or should
   the lifted row be larger still?
4. Chapter 8: *inspection becomes feedback* under *targeted welder training* — keep or cut?
5. Chapter 9: eight welds at 0.62 s spacing, Weld 090 dwelling 1.6 s in reasoning — clear?
6. Overall length (90 s) and footage speed (1.4× real time in chapters 1–2).

## Render notes (for later)

- Both hosts share `SceneHost`; `npx remotion still src/index.ts story out/f.jpg --frame=1650`
  matches `?director=1&t=55` pixel for pixel.
- The arc footage is `<Video>` (not `<OffthreadVideo>`): the compositor binary needs glibc ≥ 2.35
  and this host has 2.31. It is addressed by log time (`src/data/hero.ts`).
- The SAM mask PNGs are binary (2 KB); the ring is an SVG dilate filter, computed at render time.
