# Chapter 5 — neural-symbolic reasoning: the logic

What the 17 seconds between 39 s and 56 s claim, on what evidence, and how each claim is
drawn. Chapter 6 (56–61 s) is the collapse of the same graph and is covered at the end.
Companion to `storyboard.md`; every number below is traceable to a file in this repository.

## 1. What the viewer should conclude

The product is defective although the machine-side process trajectory is stable. Perception
alone cannot explain that. Manufacturing knowledge can propose *mechanisms*; each mechanism
predicts evidence; the predictions are tested against the real photo and the real traces; the
mechanisms that survive are ranked, without claiming a unique cause. That test — symbolic
relations reaching back into neural evidence — is the neural-symbolic moment.

## 2. Inputs at 39 s (neural observations, already on screen)

All of these are outputs recorded for weld `03-15-23-0080-05` before chapter 5 starts.

| observation | value | source |
|---|---|---|
| defect | UNDERCUT | vision (teacher chain-of-evidence, verifier pass) — `src/data/hero-case.json` `neural_observations.visual` |
| location / morphology | lower weld toe, middle-to-right; continuous toe groove; uneven bead width | same |
| bead extent | SAM 3.1 box [711, 288, 1272, 333], score 0.74; mask 20,171 px | `src/data/sam31.json`, `public/hero/plate_front_full_sam31_mask.png` |
| current | plateau mean 279.3 A, CV 0.039; arc-on mean 276.6 A; trend *keep steady*; one upward spike (321.5 A at 18.2 s); instability windows only at start/stop (rows 40–70, 248–278) | TS analyzer, `docs/ts_03-15-23-0080-05.json`; plateau rows 65–254 in `src/data/hero.ts` |
| voltage | plateau mean 17.6 V, CV 0.028; trend *keep steady*; instability windows only at start/stop | same |
| dropouts | none | same |
| fast finding | **process stable** = current STEADY · arc_stability NOMINAL · process_integrity NOMINAL | TS analyzer labels, reworded (see §7) |

Reference population (symbolic context, also real): 140 good fillet Fe410 welds, per-weld
arc-on means p5–p95 **119–182 A** and **17.5–22.3 V**; current CV p95 0.116; medians 133.7 A,
CV 0.076 (`docs/process_stats.csv`, `docs/video-data-inventory.md`). The hero weld's nominal
setpoint is 300 A / 19.0 V / 30 cm/min (dataset manifest).

## 3. Knowledge (symbolic)

kb-v1 (GraphRAG index over 45 welding documents) has these cause edges into UNDERCUT
(`hero-case.json` `symbolic_knowledge.cause_edges`, weight = number of supporting text units):

| kb-v1 source entity | w | grouped as |
|---|---|---|
| INCORRECT GUN ANGLE ("arc focus too much on the bottom plate and not enough on the top plate") | 9 | H3 torch / travel |
| TRAVEL SPEED TOO FAST ("without using enough filler metal") | 9 | H3 torch / travel |
| POOR WELDER TECHNIQUE | 8 | H3 torch / travel |
| WELDING CURRENT ("high welding current … associated with the need for a high travel speed") | 8 | H2 heat input |
| EXCESSIVE VOLTAGE | 9 | H2 heat input |
| EXCESSIVE ARC LENGTH | 7 | H2 heat input |
| ARC PRESSURE ("high arc pressure can push molten metal away from the toes") | 9 | physical mechanism behind H2 |
| ARC INSTABILITY | — | **no edge** to UNDERCUT (`symbolic_knowledge.no_edge`) |

Three mechanisms are drawn, never more. H1 *arc instability* is kept although kb-v1 has no
edge for it, because it is the simple hypothesis the fast path implies ("a defect means the
process misbehaved") and it is the one the evidence can cleanly refute — that refutation is
what sends the case from perception to reasoning.

The symbolic relations drawn on screen are *mechanism → expected evidence*:

| mechanism | expects (edge word) | reaches |
|---|---|---|
| H1 arc instability | erratic I / V | the current and voltage plateaus |
| H2 heat input | level above qualified window | the qualified window drawn under the current plateau |
| H3 torch / travel | one-sided toe groove | the undercut region on the photo; a second, thin edge: *compatible with stable I / V* → the current plateau |

Plus the fan-out *defect → candidate mechanisms* (three faint edges from the `undercut` chip to
the three words), which is the kb-v1 cause-edge set itself.

## 4. The test rule

For each mechanism H with expected evidence E(H) and the observed evidence O:

- **weakened** — O contradicts E(H). The edge turns dashed grey; the word recedes.
- **plausible** — O is consistent with E(H) but does not single H out. The edge stays solid.
- **likely** — O is consistent with E(H), H accounts for the *specific* morphology, and H is
  not contradicted by the stable process. The edge thickens; the word grows.

Nothing in this rule proves a cause. Two mechanisms can both survive; the single case cannot
separate them (§6). "Likely" is a ranking word, not "root cause".

## 5. The three tests

| | H1 arc instability | H2 heat input | H3 torch / travel |
|---|---|---|---|
| expects | erratic current or voltage inside the weld | operating level above the joint's qualified window | groove on one toe only, traces unaffected |
| observed | current CV 0.039, voltage CV 0.028 on the plateau; instability windows only at ignition and extinction; no dropouts (population CV p95 0.116 / 0.119) | plateau 279 A vs 119–182 A: above; setpoint 300 A vs 165 A typical; voltage 17.6 V inside 17.5–22.3 V | continuous groove on the lower toe only; bead width uneven; I / V steady throughout |
| what contradicts / supports | contradicted: the traces are as stable as a good weld's | supported on current, not on voltage; the process being *stable* says nothing against it | supported by morphology; not directly measurable (no torch-angle or travel sensor in the log) |
| verdict on screen | **weakened** | **plausible** | **likely** |
| chapter 6 | gone | *also consistent* | *likely mechanism* |

Why H3 outranks H2 in the video although both survive the single case: (a) the lower-toe-only
groove is the morphology kb-v1 attaches to gun angle, whereas heat input predicts toe melting
without a side preference; (b) H3 is fully compatible with a stable electrical trajectory,
which is the observation that started the escalation; (c) chapter 7 adds the longitudinal
evidence — the same lower-toe groove on the operator's earlier welds — which is what a heat
input tied to a fixed setpoint would not produce selectively. (c) is the decisive factor and it
is *illustrative* (the dataset has no operator field); see §8.

**Where the project's own record differs.** The teacher chain-of-evidence recorded for this
weld (`hero-case.json` `reasoning`) ranks *excessive arc energy* first and *torch angle /
travel* fourth, with heat input SUPPORTED and torch / work angle PLAUSIBLE, UNOBSERVED. The
video's ordering is a narrative decision that rests on (c); the storyboard states this in
`storyboard.md` ("The one place the data pushes back") and the review question is whether that
ordering is acceptable. The video never says the current was inside the window and never
names a definitive cause; heat input stays on screen as *also consistent*.

## 6. Beats (story seconds; code in `src/story/parts/Reason.tsx`)

| t | what happens | what it means |
|---|---|---|
| 39.0 | chapter starts; *disagreement* fades; photo band 400 → 340 px; current lane to 690–880, voltage lane to 905–1005 | the two anchors stay; the band between them is the reasoning space |
| 39.6–40.8 | three faint blue edges fan out from the `undercut` chip to three words: *arc instability*, *heat input*, *torch / travel* | defect → candidate mechanisms (kb-v1 cause edges) |
| 41.6–42.6 | H1 sends two edges into the current and voltage plateaus (left part, near its own column); edge word *expects erratic I / V* | mechanism → expected process evidence |
| 42.7 | the plateau on both lanes highlights orange (the fast finding's stability band) | the evidence that answers |
| 44.8 | edges turn dashed grey, word greys and shrinks; **weakened** | contradicted |
| 46.6–47.6 | H2 sends an edge to the top of the qualified window under the current plateau; *expects level above qualified window* | mechanism → operating-constraint knowledge |
| 47.7–48.3 | the window 119–182 A draws (blue band, labelled once); a dashed vertical tick marks the gap plateau → window | the level is above the window |
| 49.8 | **plausible**; 50.2: *stable ≠ optimal* above the window label | consistent; and the distinction the chapter turns on |
| 51.6–52.6 | H3 sends a thick edge to the undercut region on the photo; *expects one-sided toe groove* | mechanism → expected morphology |
| 52.7–54.8 | the groove pulses; 53.5: a thin second edge to the right part of the current plateau, *compatible with stable I / V* | morphology answers; stability does not contradict |
| 54.8 | word grows and bolds; **likely** | strongest surviving mechanism |
| 56.0–57.2 | chapter 6: H1 fades; H3 moves to centre-left at 1.1×, H2 to the right at 0.85×; edge words fade | ranking |
| 57.3 | over-labels *likely mechanism* / *also consistent* | the words the video allows itself |
| 59.6–60.6 | everything collapses into one line: **Weld 087 · undercut · torch / travel** | the diagnosis as a record |
| 60.3–62.5 | the line travels to the thumbnail's label position; chapter 7 begins | one case → memory |

## 7. Wording rules in this chapter

- *process stable*, never *nominal* or *normal*: the monitor measures stability, transients,
  dropouts and integrity, not whether the setpoint is inside a qualified window.
- *stable ≠ optimal* appears once, at the heat-input test, and nowhere else.
- Verdict words only: *weakened* / *plausible* / *likely*; chapter 6: *likely mechanism* /
  *also consistent*. No *root cause*, no *definitive*, no probabilities.
- Numbers on screen in this chapter: the window bounds 119–182 A (once). The plateau value
  279 A is *not* written; the gap is shown geometrically.
- Edge words are relations, not sentences: ≤ 5 words each.

## 8. Provenance of every element

| element | class | note |
|---|---|---|
| undercut region, `undercut` chip, `process stable` chip | recorded outputs (vision / TS analyzer); region extent ILLUSTRATIVE along the real SAM-mask lower edge | carried over from chapters 2–3 |
| traces, plateau band, voltage lane | REAL_PROJECT_DATA | `src/data/hero-signals.json` |
| qualified window | DERIVED_FROM_REAL_DATA | p5–p95 of 140 good fillet Fe410 welds |
| three mechanisms, fan-out edges, edge words | SYMBOLIC_KNOWLEDGE | kb-v1 cause edges; H1's "no edge" is itself a kb-v1 fact |
| the observed evidence each edge lands on | REAL / DERIVED | CV 0.039 / 0.028, level vs window, lower-toe-only groove |
| verdict words, edge states, chapter-6 ranking, the record line | INTENDED_SYSTEM_BEHAVIOR | not a recorded reasoner output; the project's recorded teacher ranking differs (§5) |
| the reason H3 outranks H2 | partly ILLUSTRATIVE | depends on chapter 7's operator history, which is an illustrative assignment of real welds |

## 9. Open points for the review

1. Keep the four edge words, or verdict words only?
2. Keep *stable ≠ optimal*?
3. Is the H3 > H2 ordering acceptable given §5, or should chapter 6 show both as *consistent*
   and let chapter 7 alone produce the ranking?
4. Should H1 be named *arc instability* (kb-v1 entity, no edge) or *electrical instability*
   (the wording of the fast-path's implicit hypothesis)?
