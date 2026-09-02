# WELDER hero video

Neural-Symbolic AI for the Next Generation of Smart Manufacturing — a 106 s, 1920×1080,
30 fps, silent hero video built with Remotion + React + TypeScript from WELDER project data.

## Layout

```
video/
├── docs/
│   ├── video-data-inventory.md   what data exists, what was measured, what is intended
│   ├── storyboard.md             per-scene research message, evidence, provenance, transition
│   ├── review.md                 four-role critique and the fixes it produced
│   ├── process_stats.csv         per-weld arc-on statistics (Good / Undercut / …)
│   ├── ts_03-15-23-0080-05.json  deterministic TS-analyzer output for the hero weld
│   └── vlm_*.md                  verbatim Intel baseline VLM reports (recorded, not shown)
├── public/hero/                  label-removed photos and bead crops of the hero weld
├── public/fonts/                 Inter + JetBrains Mono (variable, local)
├── scripts/
│   ├── measure_process.py        arc-on statistics → docs/process_stats.csv
│   ├── run_vlm_hero.py           merged Intel VLM on named welds
│   ├── destick_hero.py           project label-removal pipeline on the hero photos
│   └── contact_sheets.py         review sheets from a --sequence render
├── src/
│   ├── data/hero-case.json       the hero case (raw → observations → knowledge → reasoning → action)
│   ├── data/provenance.json      provenance class of every scientific element
│   ├── data/hero-signals.json    the full 309-row sensor log
│   ├── data/history.json         per-weld current for the memory scene
│   ├── components/               SignalStream, WeldImage, NeuralSentinel, ObservationToken,
│   │                             KnowledgeGraph, Cards (Rule/Hypothesis/Action/Router/EvidenceLink),
│   │                             WeldCell, ArchDiagram, SceneShell, Text
│   ├── scenes/01-…11-*.tsx       one file per scene, each exporting its duration
│   ├── styles/tokens.ts          colour / type / layout tokens (neural = warm, symbolic = cool)
│   └── Root.tsx                  composition `WelderHero` (+ one composition per scene)
└── out/                          renders (git-ignored)
```

## Commands

```bash
npm install
npm start                                   # Remotion Studio
npm run typecheck
npm run render                              # out/welder-hero.mp4 (crf 16, yuv420p)
# review sequence, one frame per second at half size:
npx remotion render src/index.ts WelderHero out/stills --sequence --image-format=jpeg --every-nth-frame=30 --scale=0.5
python scripts/contact_sheets.py out/stills out/sheets 30
# single scene:
npx remotion render src/index.ts scene-07-reasoning out/scene07.mp4
```

Data scripts run from the repository root with the project environment, e.g.
`uv run python video/scripts/measure_process.py Good,Undercut`.

## Provenance rules

Every number on screen is a measured value from weld `03-15-23-0080-05` or from the good-weld
reference set; every knowledge item is a kb-v1 entity or edge; routing, hypothesis verdicts,
memory aggregation and recommendations are intended system behaviour and are tagged as such in
`src/data/provenance.json` and disclosed in the footer. No accuracy, confidence or benchmark
figure appears anywhere.

## Live demo

`npm run demo` serves `demo/` (index.html + 1080p web encode, 6 MB; the full-resolution master is `out/welder-hero.mp4`) on port 8093 with byte-range support, reachable on the tailnet at http://100.116.161.83:8093/ and on the LAN at http://192.168.191.109:8093/. `npm run demo:build` regenerates the page from `scripts/demo_template.html`; `scripts/build_demo.py --embed` builds the self-contained Artifact version.

## Data licence

The photos under `public/hero/` are derived (label-removed) frames from the Intel Robotic Welding Multimodal Dataset, which is research-only. Keep this repository private unless redistribution of derived images has been cleared.
