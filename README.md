# WELDER hero video

Neural-Symbolic AI for the Next Generation of Smart Manufacturing — a hero video for the WELDER
project page, built with Remotion + React + TypeScript from real project data.

**Current state: storyboard v3.1, under design review.** The video is one continuous 90 s story
(one weld through the whole system) that can be scrubbed in the interactive storyboard;
nothing has been rendered from it yet. The rendered MP4 in `out/` and `demo/` is the earlier
v1 (11 scenes, 106 s), kept for reference.

## Layout

```
video/
├── docs/
│   ├── storyboard.md             v3 story, chapter table, provenance summary, review questions
│   ├── visual_grammar.md         the rules every frame follows
│   ├── reference_analysis.md     22 CV project demos studied for how they show a model working
│   ├── reference_notes/          per-reference notes
│   ├── video-data-inventory.md   what data exists and how it was measured
│   ├── process_stats.csv         per-weld arc-on statistics
│   └── ts_*.json, vlm_*.md       recorded model outputs for the hero weld
├── public/hero/                  label-removed photos, arc footage (webm), SAM 3.1 masks, history photos
├── src/
│   ├── story/Story.tsx           the video as one function of time
│   ├── story/layout.ts           tracks of the persistent objects (footage, traces, photo)
│   ├── story/parts/              what each chapter does to them
│   ├── components/               ArcClip, Photo, Trace/TraceLane, marks, Grounding (box + mask), Sweep, WeldThumb, TorchSchematic
│   ├── data/                     hero log + case, story timeline, kb-v1 mechanisms, SAM output, history welds, provenance
│   ├── lib/                      scene contract, SceneHost, track / ease / geom helpers
│   └── scenes/registry.ts        the single story scene with chapters and review keyframes
├── storyboard/                   Vite page: Director Mode (?director=1) and plain playback
├── scripts/                      shot.py (keyframes), sam_bead_mask.py, export_signals.py, destick_hero.py, …
└── legacy/                       v1 (11 scenes) and v2 (7 scenes) sources and storyboards
```

## Commands

```bash
npm install
npm run storyboard                          # http://<host>:8094/?director=1  (chapters, scrubber, keyframes)
npm run typecheck
python3 scripts/shot.py OUT t=26.5 t=56.5   # 1920×1080 keyframes from the running storyboard
npm start                                   # Remotion Studio (composition `story`)
npm run render                              # only after design freeze
```

Data scripts run from the repository root with the project environment, e.g.
`uv run python video/scripts/destick_hero.py <session>/<part>`; the SAM script runs in the
isolated SAM env (`research/sam3_meta/.venv/bin/python video/scripts/sam_bead_mask.py …`).

## Provenance rules

Every element on screen is tagged in `src/data/provenance.json` as real data, a recorded model
output, symbolic knowledge, intended system behaviour, or illustrative. Numbers on screen are
measured values from the hero weld `03-15-23-0080-05` or from the good-weld reference set; no
accuracy, confidence or benchmark figure appears anywhere. `docs/storyboard.md` states where
the data and the narrative pull in different directions.

## Data licence

The photos, footage and logs under `public/hero/` are derived, label-removed items from a few
welds of the Intel Robotic Welding Multimodal Dataset (IntelLabs, research use). They are
included for the demonstration only; the dataset's own terms apply to any further use. Model
weights and the raw dataset are not part of this repository.
