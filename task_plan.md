# Task Plan: WELDER hero video (Neural-Symbolic AI for Smart Manufacturing)

## Goal
A 90–110 s, 1920x1080, 30 fps, audio-free Remotion video that makes a first-time viewer
describe WELDER as a neural-symbolic manufacturing AI (perceive → structured observations →
knowledge-guided reasoning → ranked explanations → action → memory), built on real project data
with every scientific element provenance-tagged.

## Phases
- [x] Phase 1: Setup — video/ Remotion project scaffolded, npm installed (2026-09-02)
- [x] Phase 2: Data — inventory, hero case 03-15-23-0080-05, TS analyzer + teacher CoE + baseline VLM
      outputs collected, hero-case.json + provenance.json + history.json written (2026-09-02)
- [x] Phase 3: Storyboard — docs/storyboard.md, 11 scenes, 3180 frames, deviations recorded (2026-09-02)
- [x] Phase 4: Implementation — tokens, 9 component files, 11 scenes, Root; tsc clean (2026-09-02)
- [x] Phase 5: Render — review stills ×2 (half + full res) → polish pass (sizes, overlaps, spacing) → full MP4 (2026-09-02)
- [x] Phase 6: Review — docs/review.md, four roles; fixes: LLM-role line in Scene 7, wire-feed token
      wording, callout placement; open items listed for the user (2026-09-02)

## Key Questions
1. Is "process nominal" true for real undercut welds? → NO for level (283 A vs 134 A reference),
   YES for stability (I_cv 0.083 vs 0.076 good; spatter 0.22). Decision below.
2. Which weld? → undercut_4_03-15-23_Fe410/03-15-23-0080-05 (VAL; the one weld with teacher CoE + retrieval + gold crops)
3. Real outputs → teacher CoE (pass), retrieval units, TS analyzer labels; Intel baseline VLM says 'Spatter' (recorded, not shown)
4. kb-v1 undercut causes → WELDING CURRENT w8, TRAVEL SPEED TOO FAST w9, EXCESSIVE VOLTAGE w9, INCORRECT GUN ANGLE w9 …; no ARC INSTABILITY→UNDERCUT edge

## Decisions Made
- Hero narrative split: PROCESS INTEGRITY (stability) = NOMINAL is the fast-layer observation
  (true in data); PARAMETER LEVEL vs reference window is a symbolic RULE CHECK in the slow layer
  (283 A > 182 A p95 of good fillet Fe410 welds). Rationale: keeps the spec's disagreement trigger
  truthful, and lets the ranked explanation end where the data points (excessive heat input),
  not where the spec guessed (work angle). Spec deviation to be reported to user.
- Illustrative IDs (Operator W017, Station 04, Part A1024, Weld B087) kept as labels only,
  mapped to the real part number in provenance; disclosed as ILLUSTRATIVE_VISUALIZATION.
- Photo shown as a bead crop that excludes the printed part-number label (label leak).
- No audio; all visuals programmatic SVG/React; no generative footage.

## Errors Encountered
- pandas .cat accessor clash with a column named 'cat' → renamed column
- .venv lacks pyarrow → used `uv run --with pyarrow` for kb-v1 parquet
- destick 'clean/' folder still has labels (it is resized source); real label removal = photos_clean/ (8 welds) → ran destick_hero.py for the hero weld

## Status
**Done** — out/welder-hero.mp4 rendered; report to user pending. Open items in docs/review.md.
