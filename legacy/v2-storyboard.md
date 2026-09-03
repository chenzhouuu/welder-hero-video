# WELDER hero video — working storyboard (v2, for review)

Status: **interactive storyboard ready for design review; nothing rendered.** Rules in
`visual_grammar.md`; the analysis behind them in `reference_analysis.md`. Every scene is a pure
function of progress in `src/scenes/`, shown by the Vite storyboard (`npm run storyboard`) and
by the Remotion compositions (`npm start`, `npm run render`) through the same `SceneHost`.

Review with `http://<host>:8094/?director=1` (scene 1–7 tabs, play / pause, scrubber,
keyframe buttons, `g` safe-area guides, `n` notes). `http://<host>:8094/` plays all seven
scenes back to back with plain controls. Direct links: `?director=1&scene=5&p=0.52`.

| # | Scene | s | Dominant object | The model's mark | Words on the frame |
|---|---|---|---|---|---|
| 1 | Welding + live process sensing | 10 | real arc video, full bleed | none (light-ink traces writing in sync) | 4 units + a clock |
| 2 | Fast process inference | 6 | four traces, ink on white | read-head sweep; orange plateau bands; `steady`, `279 A`, `17.4 V` | 7 |
| 3 | Post-weld visual inference | 8 | real front photo, push-in | marker → orange region on the lower toe → `undercut` | 3 |
| 4 | Fast-flow disagreement | 6 | photo above, trace below | ink line defect → plateau, one word `unexplained` | 6 |
| 5 | Neural-symbolic reasoning | 12 | same layout | blue lines from cause words to evidence; window band; substituted checks | ≤ 14 (densest) |
| 6 | Root cause → welder training | 8 | same layout | window becomes target; `reduce welding current`; ~~300 A~~ 119–182 A; good weld's trace and photo | 8 |
| 7 | Research vision | 6 | four live thumbnails | none | 4 + title |

Total 56 s at 30 fps (1680 frames). Transitions are hard cuts, except 3→4 (one camera move
inside the same photo) and 4→5→6 (the same layout carried through).

## Per-scene intent

1. **Live sensing.** The event, not the photo. Footage is the ground; the four channels write
   underneath at 2.85× real time in white ink; the clock is log time. Nothing is a model.
2. **Fast process.** Hard cut to the finished log on white. One read-head sweep; on current and
   voltage the plateau is banded, the chip says `steady`, the value is the measured plateau
   mean. Wire feed and gas are left in ink: nothing to report.
3. **Post-weld vision.** The photo fills the frame and the camera pushes in on the bead. A
   translucent marker lands on the lower toe; the undercut region fills at 55 % in 0.3 s with a
   2 px outline; the chip `undercut` sits outside its top-left; the marker fades.
4. **Disagreement.** The photo shrinks to the top 440 px while the current trace rises from
   below, carrying its band and chip. An ink line is drawn from the groove to the steady
   plateau; `unexplained` sits on it. The fast-layer stamp fades out.
5. **Reasoning.** `slow layer` stamp. In the band between photo and trace, kb-v1 causes appear
   in the order tested. Arc instability: line to the plateau, `CV 0.039`, line goes dashed
   grey (refuted). Welding current: the qualified window 119–182 A is drawn on the trace, the
   line lands on the plateau, `279 A ∉ [119, 182] A`, line thickens (supported). Travel speed:
   dotted line ends above the lane, `no travel sensor`. Gun angle: dotted line up to the
   groove. Ranking: the supported word grows; the others recede.
6. **Root cause → action.** The window's edges strengthen (target). The cause word becomes the
   bar `reduce welding current`; the programmed setpoint `300 A` is struck through and
   `119–182 A` written beside it. A real good weld's current trace writes itself inside the
   window (`135 A`), and its photo wipes in diagonally over the undercut photo; the hero trace
   recedes to 38 %.
7. **Vision.** Four live thumbnails (scenes 1, 3, 5, 6) with `sense`, `perceive`, `reason`,
   `act`; then the title `WELDER` and one line.

## Data assets

| Asset | File | Provenance |
|---|---|---|
| Arc video, hero weld | `public/hero/arc_03-15-23-0080-05.webm` (+ `.mp4`) | REAL, transcoded from the dataset AVI |
| Six-channel log, hero weld | `src/data/hero-signals.json` | REAL (309 rows) |
| Front photo, hero weld | `public/hero/plate_front_full.jpg` | DERIVED (label repainted) |
| Undercut region | `src/data/marks.ts` | ILLUSTRATIVE |
| Plateau statistics, window | `src/data/hero.ts` | DERIVED (`docs/ts_*.json`, `docs/process_stats.csv`) |
| Causes, remedy | `src/data/hero-case.json` | SYMBOLIC (kb-v1) |
| Good weld log + photo | `src/data/02-17-23-0106-00-signals.json`, `public/hero/good_front_full.jpg` | REAL / DERIVED (label removed 2026-09-02) |

Full tags in `src/data/provenance.json` (scene-level entries `scene1…scene7`).

## Questions for the review

1. Scene 1: keep the four channels, or only current (the one the story uses)?
2. Scene 3: region band (current) vs. a bounding box vs. a full bead mask.
3. Scene 5: four hypotheses or three? Keep `CV 0.039` and `no travel sensor`, or let the line
   states carry the verdicts alone?
4. Scene 6: the recommendation wording, and whether "welder training" should appear as words
   at all, or only as the corrected weld.
5. Scene 7: end on the thumbnails, or on the title?
6. Stamps `fast layer` / `slow layer`: keep, rename, or drop.
7. Overall length (56 s) and the 2.85× footage speed in scene 1.

## Render notes (for phase 7, recorded now)

- Both hosts share `SceneHost`; `true  src/index.ts scene-05 out/s5.jpg --frame=340`
  matches the Player frame pixel for pixel (checked 2026-09-02).
- The arc footage is `<Video>`, not `<OffthreadVideo>`: Remotion's compositor binary needs
  glibc ≥ 2.35 and this host has 2.31, so frame extraction fails there; `<Video>` seeks the
  browser decoder and renders correctly (checked with a scene-01 still). If the final render
  needs frame-exact footage, the fallback is an image sequence extracted with ffmpeg.
- Footage encode: `ffmpeg -i <part>.avi -an -c:v libvpx-vp9 -crf 24 -b:v 0 -row-mt 1 -pix_fmt yuv420p -r 30 public/hero/arc_<part>.webm`
  (the VP9 WebM plays in Chromium builds without proprietary codecs; an H.264 MP4 can be made
  the same way with `-c:v libx264 -crf 18`).
- Transitions between scenes are hard cuts in `Root.tsx` (`Series`); the 3→4 camera move is
  inside scene 4 itself. Motion easing, the window ring, and the wipe timing are polish items
  for after the design freeze.
