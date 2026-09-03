# WELDER hero video

Neural-symbolic weld diagnosis, shown as a CVPR-style model demo. Remotion + React +
TypeScript; 1920×1080, 30 fps, silent. Redesigned 2026-09-02 from studied academic demos
(`docs/reference_analysis.md`) under a written visual grammar (`docs/visual_grammar.md`).

**Status: interactive storyboard under design review. The final video has not been rendered.**

## Layout

```
video/
├── docs/
│   ├── reference_analysis.md     what 22 CV project demos do, and what WELDER takes from them
│   ├── reference_notes/          per-reference answers to the ten questions
│   ├── visual_grammar.md         the binding rules for every scene
│   ├── storyboard.md             the working storyboard (v2) and review questions
│   ├── video-data-inventory.md   data that exists, what was measured, what is intended
│   └── process_stats.csv, ts_*.json, vlm_*.md   measurements behind every on-screen number
├── src/
│   ├── scenes/NN-*.tsx           seven scenes, each a pure function of progress 0..1
│   ├── scenes/registry.ts        order, durations, notes, keyframes
│   ├── components/               ArcClip, Photo, Trace, TraceLane, SplitStage, marks (Chip, Stamp, Region, Link…)
│   ├── data/                     hero weld + good weld logs, case, provenance, marks
│   ├── lib/                      SceneHost (frame → progress), asset paths, easing, geometry, layout
│   └── Root.tsx                  Remotion compositions: WelderHero + scene-01…07
├── storyboard/                   Vite page: Director Mode (?director=1) and the plain sequence
├── scripts/                      shot.py (keyframe screenshots), export_signals.py, destick_hero.py, …
├── public/hero/                  label-removed photos, arc video (WebM/MP4), fonts
└── legacy/                       the v1 (11-scene) source and its docs, kept for reference
```

## Commands

```bash
npm install
npm run storyboard                 # http://localhost:8094/?director=1  (scene tabs, play, scrub, keyframes)
npm run typecheck
npm start                          # Remotion Studio (same scenes)
true  out/shots 3:0.9 5:0.52      # keyframe PNGs via Playwright
true  src/index.ts scene-05 out/s5.jpg --frame=340
npm run render                     # only after docs/design_freeze.md exists
```

Director Mode keys: `space` play/pause, `←`/`→` one frame (`shift` ×10), `[` `]` previous/next
scene, `g` safe-area guides, `n` notes, `Home`/`End`. The URL carries `scene` and `p`.

## Provenance

Every number on screen is measured from weld `03-15-23-0080-05`, the good-weld reference set,
or weld `02-17-23-0106-00`; knowledge items are kb-v1 entities; the undercut region, the
routing and the hypothesis verdicts are intended system behaviour or illustration and are
tagged as such in `src/data/provenance.json`. No accuracy, latency or confidence figure appears.

## Data licence

Photos and the arc video under `public/hero/` are derived, label-removed material from two
welds of the Intel Robotic Welding Multimodal Dataset (research use; the dataset's terms
apply). Model weights and the raw dataset are not part of this repository.
