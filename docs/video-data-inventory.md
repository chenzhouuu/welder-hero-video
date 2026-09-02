# WELDER hero video — data inventory

Compiled 2026-09-02 from the repository `/home/chen/weld-vlm-demo` and the external dataset
mount. Every item is tagged with the provenance class used in `src/data/provenance.json`:
`REAL_PROJECT_DATA`, `CURRENT_MODEL_OUTPUT`, `DERIVED_FROM_REAL_DATA`, `SYMBOLIC_KNOWLEDGE`,
`INTENDED_SYSTEM_BEHAVIOR`, `ILLUSTRATIVE_VISUALIZATION`.

## 1. Dataset (REAL_PROJECT_DATA)

- Root: `/home/chen/data2/weld_moe/data/raid/intel_robotic_welding_dataset` (42 GB, 236 session
  dirs, 4,040 welds, `manifest.csv`). Intel Robotic Welding Multimodal Dataset; research-only.
- Per weld `<session>/<part_no>/`: `<part_no>.csv` (6-channel process log, ~8.6 Hz, median
  interval 0.116 s), `<part_no>.avi` (arc video), `<part_no>.flac` (audio), `images/*.jpg`
  (5 post-weld photos, 2000×900).
- CSV header (verbatim): `Date,Time,Part No,Pressure,CO2 Weld Flow,Feed,Primary Weld Current,Wire Consumed,Secondary Weld Voltage,Remarks`.
  Units: bar, L/min, mm/min, A, mm, V. Arc-on gate used project-wide: current > 5 A.
- Manifest columns (WPS-like setpoints): `CATEGORY,WELD_TYPE,THICKNESS_MM,STEEL_TYPE,SAMPLES,CURRENT_A,VOLTAGE_V,GAS_BAR,ROBOT_SPEED_CPM,DIRECTORY,SUBDIRS,SPLIT`.
  No operator, station, or WPS document exists in the dataset. Nominal params are known to be
  unreliable in places (project note); measured CSV values are used instead.
- 12 classes; Undercut = 160 welds in 9 sessions (7 × Fe410 fillet on 2023-03-15, 2 × BSK46 on
  2023-03-20). Class code is the last two digits of the part number and is printed on a paper
  label in every photo (label leak, measured by `research/d19_ocr_leak.py`). The video therefore
  uses label-removed photos only.

### Measured process contrast, fillet Fe410 (DERIVED_FROM_REAL_DATA)

Computed by `video/scripts/measure_process.py` → `video/docs/process_stats.csv` (arc-on rows,
current > 5 A). Medians over welds:

| class (n) | I mean A | I CV | V mean V | V CV | feed mm/min | gas L/min | nominal I A | nominal speed cm/min |
|---|---|---|---|---|---|---|---|---|
| Good (140) | 133.7 | 0.076 | 20.2 | 0.075 | 41.2 | 22.7 | 165 | 25 |
| Undercut (140) | 283.0 | 0.083 | 17.5 | 0.109 | 122.5 | 13.2 | 300 | 30 |
| Spatter, non-fillet (280) | 141.2 | 0.222 | 14.7 | 0.325 | 39.9 | 13.1 | 165 | 35 |

Reference window from good fillet Fe410 welds (p5–p95 of per-weld arc-on means): current
118.7–182.0 A, voltage 17.5–22.3 V, current CV ≤ 0.116 (p95), voltage CV ≤ 0.119 (p95).

Consequence for the narrative: the undercut welds were produced at roughly twice the reference
current and three times the wire feed, with an arc that is as *stable* as a good weld's. So
"process integrity nominal" is true for stability and false for level. The video splits these
two: stability is a fast-layer observation, the level-vs-window comparison is a symbolic rule
check in the slow layer. This deviates from the specification's "CURRENT: NOMINAL" wording.

## 2. Hero weld (REAL_PROJECT_DATA)

`undercut_4_03-15-23_Fe410/03-15-23-0080-05` — Undercut, FILLET, 7 mm, Fe410, manifest split
VAL (project split v1 also non-train). Nominal 300 A / 19.0 V / 3.2 bar CO2 / 30 cm/min.
Chosen because it is the one undercut weld for which every downstream project artefact exists
(bead boxes, label-removed photo, 6-channel plot, teacher chain-of-evidence with verifier
pass, retrieval record).

- Photos: 5 originals under `images/`; label-removed 1200×540 versions
  `research/detector_check/run200/clean/180_Undercut.jpg` (view 0) and
  `research/detector_check/views/clean/168_{1,2,3,4}.jpg`. Note two index systems: run200 idx
  180 and gate2/views idx 168 both map to this weld (verified by subdir).
- Bead crops (label removed): `run200/crops_gold_nosticker/180_Undercut.jpg` (615×81),
  `views/crops_nosticker/168_1_Undercut.jpg` (566×64), `168_2_Undercut.jpg` (361×405).
- Gold bead box (run200, picked by hand): x0 668.9, y0 268.5, x1 1283.7, y1 348.9 on the
  1200×540 frame? — no: on the 2000×900 original (see `gold_boxes.csv` row idx 180).
- Signal plot used by the teacher: `research/gate2/inputs/plots/168.png` (6×1 stacked).
- Process log: 309 rows, arc on from row 55 to 264 (t ≈ 6.4–30.6 s), wire consumed 4,765.9 mm.

### Deterministic TS analyzer output (`research/ts_analyzer.py`, DERIVED_FROM_REAL_DATA)

Saved at `video/docs/ts_03-15-23-0080-05.json`.

| channel | trend | arc-on mean ± std | spikes | level shifts | instability windows |
|---|---|---|---|---|---|
| Primary Weld Current | keep steady | 276.6 ± 22.4 A | 1 up (row 157, +310 A prominence vs. zero baseline) | +279 A @55, −279 A @265 (arc start/stop) | rows 40–70, 248–278 (= start/stop transients) |
| Secondary Weld Voltage | keep steady | 17.6 ± 1.5 V | start/stop transients | +17.1 @50, −17.5 @265 | 35–71, 250–279 |
| Feed | increase | 124.0 ± 39.5 mm/min | none | none | 0–21, 50–73 |
| CO2 Weld Flow | keep steady | 13.3 ± 6.2 L/min | 1 up (row 88, start overshoot) | start overshoot then settle | 42–148, 266–308 |
| Pressure | decrease | 0.21 ± 0.21 bar | — | — | start/stop |

Arc-on plateau (rows 65–254, first/last 10 arc-on samples excluded): current 279.3 A, std
10.8 A, CV 0.039, range 221.5–321.5 A (peak 321 A at t ≈ 18.2 s); voltage 17.4 V, CV 0.028;
feed 127 mm/min, CV 0.26 (ramps through the weld); gas 13.9 L/min. All instability windows the
analyzer finds coincide with arc ignition/extinction; none lies inside the plateau.

## 3. Real model outputs on the hero weld (CURRENT_MODEL_OUTPUT)

### 3a. WELDER-CoE teacher record (`research/p8_mve/coe.jsonl`, idx 168, status `pass`, 1 round)

Teacher = gpt-5.6-terra, label-guided (the class name is in the prompt), inputs = label-removed
crop `168_1_Undercut.jpg` + plot `168.png` + retrieved kb-v1 units; verifier checks passed.
Verbatim fields used by the video:

- visual_evidence[0]: "A dark, continuous linear groove/depression is visible along the lower
  weld toe, most pronounced through the middle-to-right portion of the bead. The weld metal does
  not consistently blend into and fill the toe region, which is direct visual evidence of
  Undercut." (confidence 0.94)
- visual_evidence[1]: "The bead profile is uneven with variable width and reinforcement, and the
  upper toe is locally irregular…" (0.79)
- process_evidence[0] (Primary Weld Current): "Current rises abruptly at approximately 6 s to
  about 280-300 A and remains high during the active weld interval. A notable transient peak
  near 325 A occurs around 18.5 s…" supporting_metric "Active-weld current band approximately
  270-300 A; transient peak approximately 325 A near 18.5 s." (0.87)
- plausible_causes: (1) "Excessive or locally elevated arc energy during the active weld
  interval" 0.90 [visual, process, kb-v1:industry/bernard_causes_of_gmaw_flaws.md#c0002];
  (2) "Transient current peak and high-current operating band…" 0.86; (3) "Unstable feed
  progression…" 0.80 [kb-v1:physics/04_molten_pool_dynamics_humping_undercut_overlap.md#c0001];
  (4) "Possible non-optimal torch angle or travel technique, inferred from one-sided lower-toe
  predominance…" 0.72 [visual, kb-v1:industry/bernard_basics_mig_troubleshooting.md#c0001].
- uncertainty: "…no synchronized travel-position signal or arc-voltage trace is available;
  therefore, the exact spatial location and relative contribution of torch angle versus travel
  behavior cannot be quantified from the supplied data alone."

The teacher's confidences are model self-reports, not measurements; the video shows them only
as qualitative rank order.

### 3b. Retrieval record (`research/p8_mve/evidence.jsonl`, idx 168)

Query 1 (verbatim): "What process conditions and physical mechanisms cause undercut in CO2 MAG
(GMAW) welding of steel, and how can it be prevented or corrected?" → 12 unit ids, including
`kb-v1:industry/bernard_causes_of_gmaw_flaws.md#c0002`, `kb-v1:industry/kemppi_common_welding_defects.md#c0001`,
`kb-v1:physics/04_molten_pool_dynamics_humping_undercut_overlap.md#c0001`, `kb-v1:twi/jk004_mig_mag_welding_process.md#c0000`.

### 3c. Intel baseline VLM (`Intel/qwen3.5-2b-vlm-weld-explainability-lora`, merged weights)

Run by `video/scripts/run_vlm_hero.py` with the model-card prompt and sampling
(temperature 1.5, min_p 0.1, seed 0) and greedy; middle photo + arc-on telemetry.
Result on the hero weld, both modes: **"Bad Weld — Spatter"** (ground truth Undercut). Same on
03-15-23-0023-05 (Spatter) and 03-15-23-0106-05 (Crater Cracks, greedy). Files:
`video/docs/vlm_03-15-23-0080-05_{sampled,greedy}.md`. Recorded for honesty; **not used as a
foil in the video** (n = 3 is not an evaluation).

### 3d. Other real outputs (not used directly)

- Bead detectors (DINO / SAM3 / SAM3.1) on 920 images: `research/detector_check/eval920/`.
- Morphology descriptions (gpt-4o, qwen-27b) for one weld per class: `research/gate3/morphology_v4/`.
- Gate 2/3 VLM contests, reasoning demo on a porosity weld: `research/gate2/`, `research/gate3/`, `slides/data/reasoning_demo.jsonl`.

## 4. Knowledge base kb-v1 (SYMBOLIC_KNOWLEDGE)

`research/kb_graphrag/runs/kb-v1/output/` — GraphRAG 3.1.1 index over 45 documents
(TWI Job Knowledge ×22, physics notes ×8, vendor troubleshooting guides ×7, reviews ×8);
4,986 entities, 9,855 relationships, 461 text units. Frozen; hash-pinned in `ARCHIVE_INFO.json`.

Entity `UNDERCUT` (WELD_DEFECT, degree 77): "an irregular groove at the toe of a run in the
parent metal…". Edges used in the video (source → UNDERCUT, weight, description excerpt):

| source | type | w | description |
|---|---|---|---|
| WELDING CURRENT | PROCESS_PARAMETER | 8 | High welding current will also cause undercut; generally associated with the need for a high travel speed to avoid overfilling |
| TRAVEL SPEED / TRAVEL SPEED TOO FAST | PROCESS_PARAMETER / CONDITION | 17 / 9 | High travel speed can contribute to undercut by causing insufficient fill |
| EXCESSIVE VOLTAGE | PROCESS_CONDITION | 9 | Excessive voltage is a common cause of undercut |
| EXCESSIVE ARC LENGTH | PROCESS_CONDITION | 7 | contributes to undercut |
| INCORRECT GUN ANGLE / TORCH ANGLE | PROCESS_CONDITION / PARAMETER | 9 / 8 | arc focus too much on the bottom plate … can create undercut |
| POOR WELDER TECHNIQUE | PROCESS_CONDITION | 8 | Poor welder technique can cause undercut |
| ARC PRESSURE | — | 9 | High arc pressure can push molten metal away from the toes |
| MARANGONI (THERMOCAPILLARY) FORCES | — | 9 | cause or promote undercutting |

Remedy edges: REDUCE TRAVEL SPEED (18), REDUCE WELDING CURRENT (9), REDUCE VOLTAGE (8),
ANGLE TORCH TO PUSH WELD METAL TO FILL MELTED GROOVE (9), INCREASE WIRE FEED SPEED (9),
PAUSE LONGER AT EACH SIDE OF THE WELD BEAD (16), DEPOSIT AN ADDITIONAL WELD BEAD (9), BLEND GRINDING (9).

Acceptance criteria entities: `BS EN ISO 5817 | UNDERCUT | STRINGENT | T > 3 MM` (0.5 mm),
`… | MODERATE | T > 3 MM` (1 mm), `AWS D1.1 | UNDERCUT | LIMIT 1 MM`. Related conditions:
`ARC INSTABILITY` (PROCESS_CONDITION, deg 15), `ARC STABILITY` (deg 24), `HEAT INPUT`
(PROCESS_PARAMETER, deg 99). Note: **no edge in kb-v1 links ARC INSTABILITY to UNDERCUT** —
this is what lets the slow layer weaken the "instability" hypothesis on knowledge grounds as
well as on evidence.

## 5. WPS / standards

No WPS document exists. The video's "WPS-014" is an illustrative label whose window is the
good-weld reference window from §1 (DERIVED_FROM_REAL_DATA) and whose acceptance limits are the
kb-v1 ISO 5817 / AWS D1.1 entities (SYMBOLIC_KNOWLEDGE). Disclosed as such in provenance.

## 6. Existing figures and demo

- Paper figures: `6a85f47bc4de3ae6ffb8d702/figures/` (fig1 teaser, fig2 pipeline, figS2 porosity
  subgraph, figS5 worked trace); assets `welder_plate.png`, `ts_grid6.png`, `kb_graph.png`.
- Deck figures: `slides/figs/` (110 files; `coe_ts_grid6.png`, `kb_types`, `leak_*`).
- Demo app: `web/` + `api/` console for the Intel VLM (screenshots in `outputs/`). Not used.

## 7. Paper vocabulary

`\method` = WELDER; `\kbname` = WELDER-KB (kb-v1); `\coename` = WELDER-CoE; `\studentname` =
WELDER-2B. The paper uses teacher / student / verifier / retrieval / gate. "Fast", "Slow",
"sentinel", "router" do not appear in the paper; they are the video specification's terms and
are used in the video as names for intended system roles.

## 8. What is intended behaviour, not implemented (INTENDED_SYSTEM_BEHAVIOR)

Fast/slow routing on inconsistency; a neural process sentinel (the current analyzer is
deterministic statistics); symbolic hypothesis testing over kb-v1 edges at inference time;
traceability graph (operator / station / part identifiers do not exist in the data);
historical aggregation and training-focus recommendation. The paper's implemented position is
Kautz Type 4 (knowledge spent at training time); the video shows the inference-time
neural-symbolic workflow the project is building toward.
