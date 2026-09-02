# WELDER hero video — storyboard

Target 106 s, 1920×1080, 30 fps, silent. Composition `WelderHero`, 3180 frames.
Data: `src/data/hero-case.json`, `src/data/hero-signals.json`; provenance classes in
`src/data/provenance.json`. Scene files `src/scenes/NN-*.tsx`.

Colour language (`src/styles/tokens.ts`): the **neural** world is continuous — molten
orange/amber signal traces, soft glows, streaming motion. The **symbolic** world is discrete —
cool cyan/teal tokens, hairline graph edges, stepwise motion. The transition from warm-fluid to
cool-structured is the visual signature and is repeated at every neural→symbolic hand-off.

Design constraints from the specification: no factory footage, no generative video, no
audio, no probabilities presented as measurements, no hidden chain-of-thought, no worker
scores. Every on-screen number is a measured value from the hero weld or its reference set.

| # | Scene | Frames | Time |
|---|---|---|---|
| 1 | Manufacturing world | 0–240 | 0–8 s |
| 2 | Multimodal sensing | 240–480 | 8–16 s |
| 3 | Fast neural perception | 480–870 | 16–29 s |
| 4 | Neural-symbolic bridge | 870–1080 | 29–36 s |
| 5 | Evidence inconsistency | 1080–1320 | 36–44 s |
| 6 | Symbolic knowledge | 1320–1650 | 44–55 s |
| 7 | Mechanism reasoning | 1650–2100 | 55–70 s |
| 8 | From prediction to explanation | 2100–2340 | 70–78 s |
| 9 | Traceability and memory | 2340–2640 | 78–88 s |
| 10 | Human-centred feedback | 2640–2880 | 88–96 s |
| 11 | Broader vision + end card | 2880–3180 | 96–106 s |

Scenes overlap by 12 frames for cross-fades; each scene owns its enter/exit.

---

## Scene 1 — Manufacturing world (0–8 s)

- **Research message:** a weld is a physical event that leaves evidence in several channels.
- **Teaches:** the object of study is the *event*, not the photo.
- **Raw input:** none yet; stylised SVG cell (robot torch, L-plate fillet joint, arc glow).
- **Neural / symbolic:** none.
- **Visible evidence:** arc travels along the joint (t = 0 → 24 s of weld time compressed to 5 s);
  four evidence streams peel off the arc: post-weld image, I(t), V(t), WFS(t), and a context card.
- **Animation:** torch moves left→right; bead grows behind it; a live sparkline of the real
  current trace draws under the cell; at 5 s the physical cell desaturates and its outline
  becomes a wireframe (physical → digital).
- **Text:** title card "WELDER" small at top-left; "Every weld generates more than a product.
  It generates evidence." Labels: Operator W017 · Station 04 · Part A1024 · Weld B087.
- **Provenance:** cell = ILLUSTRATIVE; sparkline = REAL (hero-signals current); labels = ILLUSTRATIVE.
- **Transition:** wireframe cell shrinks to a corner; streams fan out into Scene 2 panels.

## Scene 2 — Multimodal sensing (8–16 s)

- **Research message:** the manufacturing world is multimodal, and raw data is not understanding.
- **Teaches:** what the inputs actually are.
- **Raw input:** label-removed plate photo (real); I(t), V(t), WFS(t), gas(t) traces (real,
  full 309-row log); context: FILLET · 7 mm · Fe410 · CO2 MAG · WPS-014.
- **Neural / symbolic:** none.
- **Visible evidence:** the four traces draw in real time-compressed sync (arc on 6.4 → 30.6 s);
  axes carry units; the photo sits top-left with a slow push-in on the bead.
- **Text:** modality headers IMAGE · CURRENT I(t) · VOLTAGE V(t) · WFS(t) · CONTEXT. Bottom line:
  "From sensing to understanding."
- **Provenance:** all REAL_PROJECT_DATA except WPS-014 label (ILLUSTRATIVE).
- **Transition:** traces keep flowing; two "sentinel" frames slide in around the image and the signals.

## Scene 3 — Fast neural perception (16–29 s)

- **Research message:** neural models turn continuous data into structured observations.
- **Teaches:** where the neural part is and what it outputs.
- **Raw input:** bead strip (real, label-removed) and the traces.
- **Neural component:** two sentinels in parallel. Visual Sentinel: image → conv/attention
  block (animated feature grid) → tokens. Process Sentinel: traces → temporal encoder (sliding
  window) → tokens. Both labelled NEURAL.
- **Symbolic component:** the emitted tokens are the first symbolic objects (cool colour).
- **Visible evidence:** heatmap band sweeps along the bead and stops at the lower toe; a window
  slides along the current trace and the plateau statistic prints (279 A, CV 0.039).
- **Text (tokens):** Visual: DEFECT · UNDERCUT / LOCATION · WELD TOE / MORPHOLOGY · CONTINUOUS
  TOE GROOVE. Process: ARC STABILITY · NOMINAL / CURRENT · STEADY 279 A / VOLTAGE · STEADY 17.4 V /
  WIRE FEED · RAMPING 124 mm/min / GAS · FLOWING 13 L/min. Header line: "WHAT DO WE OBSERVE?"
  Sub: "RAW CONTINUOUS DATA → STRUCTURED OBSERVATIONS".
- **Provenance:** defect token = INTENDED (see provenance.json); location/morphology = CoE
  teacher output; process values = DERIVED; state words = DERIVED vs. reference; the neural
  process sentinel itself = INTENDED. Tag "observation" not "prediction"; no confidence numbers.
- **Transition:** the image and traces dim and blur; the tokens stay sharp (into Scene 4).

## Scene 4 — Neural-symbolic bridge (29–36 s)

- **Research message:** symbolic reasoning operates over what neural models perceive.
- **Teaches:** the interface: an inspectable intermediate representation.
- **Raw input:** recedes to 10 % opacity.
- **Neural component:** fading.
- **Symbolic component:** three token groups snap onto a grid — VISUAL, PROCESS, CONTEXT —
  each token rendered as `KEY = VALUE` chips with a hairline border.
- **Visible evidence:** the same chips as Scene 3 plus context chips JOINT = FILLET ·
  MATERIAL = Fe410 · THICKNESS = 7 mm · WPS = WPS-014.
- **Text:** "Neural models perceive the world." then "Symbolic reasoning operates over what they
  perceive." Small caption: "structured observations · inspectable · no probabilities hidden inside".
- **Provenance:** as Scene 3; context = REAL except WPS label.
- **Transition:** the grid tightens; two chips (PRODUCT QUALITY, PROCESS INTEGRITY) are pulled
  forward for Scene 5.

## Scene 5 — Evidence inconsistency (36–44 s)

- **Research message:** disagreement between semantic observations is the trigger for reasoning.
- **Teaches:** this is not an ensemble conflict; it is a failed simple explanation.
- **Visible evidence:** left chip PRODUCT QUALITY = ABNORMAL (warm), right chip PROCESS
  INTEGRITY = NOMINAL (cool). A small rule card appears: "Simple hypothesis: electrical process
  instability caused the defect → predicts PRODUCT ABNORMAL ∧ PROCESS ABNORMAL". Observed row
  underneath: ABNORMAL ∧ NOMINAL. A mismatch mark on the second column. Router badge flips
  from FAST (monitor / archive) to SLOW (reason).
- **Text:** "EVIDENCE INCONSISTENCY" → "The observations cannot be explained by the simplest
  hypothesis." → "FAST NEURAL PERCEPTION ↓ SLOW SYMBOLIC REASONING". Small routing legend:
  sufficient → archive/monitor; abnormal · uncertain · high-risk · contradictory → reason.
- **Provenance:** observed states DERIVED; routing INTENDED.
- **Transition:** the background cools from charcoal-amber to deep blue-black; a graph grid fades in.

## Scene 6 — Symbolic knowledge enters (44–55 s)

- **Research message:** the causes of undercut are not in the pixels; they are in manufacturing knowledge.
- **Teaches:** what the symbolic complement is (a knowledge graph with typed edges).
- **Symbolic component:** WELDER-KB (kb-v1) subgraph: centre node UNDERCUT (WELD_DEFECT);
  cause nodes WELDING CURRENT, TRAVEL SPEED TOO FAST, EXCESSIVE VOLTAGE, EXCESSIVE ARC LENGTH,
  INCORRECT GUN ANGLE, POOR WELDER TECHNIQUE, ARC PRESSURE; acceptance nodes ISO 5817 0.5 mm /
  1 mm, AWS D1.1 1 mm; remedy nodes REDUCE WELDING CURRENT, REDUCE TRAVEL SPEED, ANGLE TORCH…
  Edge weights shown as line thickness. One edge description reveals on hover-style callout:
  "High welding current will also cause undercut…".
- **Visible evidence:** the observation chips from Scene 4 float at the left; dotted links
  connect DEFECT = UNDERCUT to the graph's UNDERCUT node, and CURRENT = 279 A to WELDING CURRENT.
  A WPS rule card: "WPS-014 window: 119–182 A (qualified good welds)".
- **Text:** "SYMBOLIC KNOWLEDGE" header; caption "kb-v1 · 4,986 entities · 9,855 relations ·
  45 welding documents"; footnote "Not present in the pixels. Present in manufacturing knowledge."
- **Provenance:** graph = SYMBOLIC_KNOWLEDGE (verbatim kb-v1); counts REAL; WPS window DERIVED.
- **Transition:** graph slides left and compresses; a hypothesis column rises on the right.

## Scene 7 — Mechanism-guided reasoning (55–70 s)

- **Research message:** knowledge + observations → hypothesis testing → ranked explanations.
- **Teaches:** the symbolic structures are *used*: prediction from a mechanism, checked against evidence.
- **Symbolic component:** four hypothesis cards H1–H4 (names from kb-v1 cause entities), each
  with PREDICTS / OBSERVED / VERDICT rows. Evidence links animate from observation chips to the
  OBSERVED row; a rule-check row for H2 evaluates `279 A ∉ [119, 182] A` with a visible tick.
- **Sequence:** H1 Electrical instability — predicts fluctuating I/V — observed CV 0.039 / 0.028,
  no instability window in plateau, no ARC INSTABILITY → UNDERCUT edge — WEAKENED (card dims,
  moves down). H2 Excessive heat input — predicts current above window with stable arc —
  observed 279 A vs 119–182 A, feed 124 vs 41 mm/min, edge WELDING CURRENT → UNDERCUT (w8) —
  SUPPORTED (card brightens, moves to top). H3 Travel speed too fast — predicts high travel
  speed — no travel sensor; nominal 30 vs 25 cm/min — PLAUSIBLE, UNVERIFIED. H4 Torch / work
  angle — predicts one-sided lower-toe groove — image shows lower-toe predominance; no angle
  sensor — PLAUSIBLE, UNOBSERVED. Final ranked column H2 > H3 ≈ H4 > H1.
- **Text:** header "WHY COULD THIS HAVE HAPPENED?"; formula strip "KNOWLEDGE × OBSERVATIONS →
  HYPOTHESIS TESTING → RANKED EXPLANATIONS"; verdict words only (no percentages).
- **Provenance:** hypotheses SYMBOLIC; evidence DERIVED; verdicts INTENDED, rank order agrees
  with the teacher CoE (CURRENT_MODEL_OUTPUT) — a small tag "teacher chain-of-evidence:
  verified ✓" sits on the panel.
- **Transition:** cards collapse into a single explanation card.

## Scene 8 — From prediction to explanation (70–78 s)

- **Research message:** detection answers WHAT; neural-symbolic reasoning investigates WHY.
- **Teaches:** why this is not multimodal classification.
- **Visible evidence:** split screen. Left "TRADITIONAL NEURAL INSPECTION": IMAGE → [net] →
  UNDERCUT, then stops. Right "WELDER": IMAGE + PROCESS → NEURAL PERCEPTION → STRUCTURED
  OBSERVATIONS → SYMBOLIC KNOWLEDGE → MECHANISM HYPOTHESIS → ACTION, each stage lighting in turn.
  Explanation card: "MECHANISM-CONSISTENT EXPLANATION — heat input above the qualified window
  (279 A vs 119–182 A) with a stable arc; toe groove consistent with WELDING CURRENT → UNDERCUT.
  Travel-speed and torch-angle contributions not separable without added sensing."
- **Text:** "Detection tells us WHAT." / "Neural-symbolic reasoning investigates WHY." Tag
  "LIKELY ROOT-CAUSE HYPOTHESIS" (never "root cause proven").
- **Provenance:** explanation INTENDED built from DERIVED evidence and SYMBOLIC edges; the
  teacher's uncertainty sentence is quoted (CURRENT_MODEL_OUTPUT).
- **Transition:** the explanation card shrinks into a case record chip.

## Scene 9 — Traceability and memory (78–88 s)

- **Research message:** one weld is an observation; repeated observations become manufacturing experience.
- **Teaches:** the system does not reset after inference.
- **Visible evidence:** chain Weld B087 → Part A1024 → Station 04 → Operator W017 draws as a
  vertical graph; then the view zooms out to a timeline of the cell's undercut cases (real
  aggregate: 140 welds, 7 sessions, 2023-03-15), each plotted by arc-on mean current against
  the 119–182 A window — every dot above the window. A bar "CASE → HISTORY → PATTERN → KNOWLEDGE"
  fills stage by stage.
- **Text:** "One weld is an observation. Repeated observations become manufacturing experience."
  Caption: "Aggregation over the project's undercut welds; operator/station labels illustrative."
- **Provenance:** chain ILLUSTRATIVE; dots DERIVED (process_stats.csv); aggregation step INTENDED.
- **Transition:** the pattern summary card slides up into Scene 10.

## Scene 10 — Human-centred feedback (88–96 s)

- **Research message:** accumulated reasoning becomes support for people and process, not surveillance.
- **Teaches:** the action layer.
- **Visible evidence:** three action cards. RECURRING PATTERN: undercut cases with current above
  the WPS window and a stable arc. PROCESS: verify programmed current against WPS-014 before the
  next batch; kb-v1 remedy REDUCE WELDING CURRENT. SUPPORT: parameter set-up / WPS adherence;
  work-angle consistency only if H4 is confirmed by added sensing. INSPECTION: gauge toe groove
  against ISO 5817 (0.5 mm / 1 mm).
- **Text:** "operator support · process improvement · continuous learning". Explicit
  footnote: "No worker rankings. No individual scores."
- **Provenance:** INTENDED (wording from kb-v1 remedy edges and ISO 5817 entities).
- **Transition:** cards recede into a single WELDER node; the frame zooms out.

## Scene 11 — Broader vision and end card (96–106 s)

- **Research message:** welding is one instance of a general neural-symbolic manufacturing architecture.
- **Teaches:** the thesis in one diagram.
- **Visible evidence:** inputs VISION · SIGNALS · SENSORS · MACHINES · HUMANS → NEURAL PERCEPTION →
  STRUCTURED OBSERVATIONS → SYMBOLIC REASONING (knowledge · rules · mechanisms · history) →
  MANUFACTURING INTELLIGENCE (diagnosis · action · learning). WELDER highlighted as the instance.
- **Text:** "NEURAL MODELS PERCEIVE." / "SYMBOLIC KNOWLEDGE STRUCTURES REASONING." / "TOGETHER
  THEY ENABLE MANUFACTURING INTELLIGENCE." Title: "Neural-Symbolic AI for the Next Generation of
  Smart Manufacturing". Sub: "WELDER — a case study in intelligent welding inspection and
  diagnosis." Final line: "Perceive with neural models. Reason with manufacturing knowledge."
  Disclosure (small): "System vision demonstration using WELDER project data. Some reasoning
  and downstream capabilities illustrate intended system behavior."
- **Provenance:** ILLUSTRATIVE diagram; disclosure verbatim from the specification.
- **Transition:** hold, fade to black.

---

## Specification deviations (recorded here, not hidden)

1. Scene 3 process tokens read STEADY / NOMINAL for *stability* and print the measured level
   (279 A). The specification's "CURRENT: NOMINAL" would be false for this dataset: undercut
   welds run at about twice the good-weld current. The window check is done in the symbolic layer.
2. Scene 7 ends with H2 (heat input) SUPPORTED and H3/H4 plausible-but-unverified, rather than
   H2/H3 "remain plausible" with no winner. The data and the teacher CoE both point to heat input.
3. Scene 10 training focus is parameter set-up / WPS adherence first, work angle second
   (conditional), because H4 is unobserved in this cell.
