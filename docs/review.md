# WELDER hero video — critic review (round 1, after polish pass)

Reviewed from the one-frame-per-second sequence (`out/stills`, `out/sheets`) rendered
2026-09-02 after the first polish pass. Each role answers the questions in the specification
(§17). "Fix" lines record what was changed in response; "Open" lines are left for the user.

## 1. Neural-symbolic researcher

- **Is this genuinely neural-symbolic?** The neural layer has a defined job (raw image and
  signals → typed observations, Scene 3) and the symbolic layer has a defined job (typed
  knowledge graph + rule check + hypothesis verdicts, Scenes 6–7). The two meet at an explicit
  intermediate representation (Scene 4). Yes, as an architecture; the video does not claim
  more than that.
- **Where does neural perception end?** At the token grid in Scene 4. The raw data is blurred
  out under the tokens so the boundary is visible.
- **Where does symbolic reasoning begin?** Scene 5: a stated hypothesis makes a prediction
  over the observation vocabulary, and the prediction is checked. Scene 7 repeats this for
  four hypotheses, one of which is a rule evaluated on a measured number (279 A ∉ [119, 182] A).
- **Are symbolic structures actually used?** Yes in three ways: (i) hypothesis names are kb-v1
  cause entities, (ii) the WPS window is a rule with a visible verdict, (iii) the absence of an
  ARC INSTABILITY → UNDERCUT edge is used as evidence against H1.
- **Would a reviewer say "LLM + RAG called neural-symbolic"?** The risk is real because the
  project's implemented teacher is an LLM over retrieved text. Fix: Scene 7 now carries the
  line "knowledge-guided reasoning · rules, graph edges, retrieved text" and "not free-form
  chain-of-thought: every step is an inspectable artefact". The provenance file tags the
  hypothesis verdicts as INTENDED_SYSTEM_BEHAVIOR. Open: the paper's implemented position is
  Kautz Type 4 (knowledge spent at training time); the video shows inference-time routing.
  This is disclosed in the inventory and the footer, not in the video body.

## 2. Manufacturing researcher

- **Meaningful manufacturing knowledge?** Cause edges are the standard undercut causes
  (current, travel speed, voltage/arc length, gun angle, technique) quoted from kb-v1;
  acceptance limits are the ISO 5817 / AWS D1.1 values the knowledge base extracted.
- **Process signals vs product defects distinguished?** Yes: product quality comes from the
  image, process integrity from the log; Scene 5 keeps them as two separate chips.
- **Is "process integrity nominal" defensible for a weld at 279 A?** Only as a stability
  statement, and the video says so: STEADY / NOMINAL are stability words, the level is printed
  beside them, and the level-vs-window comparison is done as a rule in the slow layer. Fix:
  the wire-feed token was changed from RAMPING to CONTINUOUS because the ramp is present in
  every weld in the cell (checked on 15 good and 10 undercut welds) and would mislead.
- **Are the recommendations actionable?** Verify programmed current against the WPS, reduce
  current and re-qualify, gauge toe depth against ISO 5817 limits: yes. Work-angle training is
  stated as conditional on H4 being confirmed.
- **Causal caution?** "Likely root-cause hypothesis", "mechanism-consistent explanation",
  the teacher's own uncertainty sentence quoted verbatim, and H3/H4 left open.

## 3. CVPR reviewer

- **What is technically new?** The interface (typed observations that a rule/graph layer can
  consume) and the routing on inconsistency. Scene 4 and Scene 5 carry this.
- **Why not multimodal classification?** Scene 8 left panel: a label, then silence. Scene 4
  caption: not a probability vector handed to another black box.
- **Why not an LLM agent?** Scene 7's inspectable-artefact line; no free-form reasoning is
  shown anywhere.
- **Why is symbolic knowledge necessary?** Scene 6: the causes of undercut are not in the
  pixels; the rule window is not in the pixels either.
- **Why fast–slow?** Scene 5: sufficient → archive/monitor; abnormal / uncertain / high-risk
  / contradictory → reason. The routing decision is "when does perception need reasoning".
- **Overclaims?** None found: no accuracy, no confidences, no "root cause proven". The Intel
  baseline VLM's wrong answer on this weld is recorded in the docs and deliberately not used
  as a foil.

## 4. First-time viewer (one muted viewing)

- **What does WELDER do?** Watches welds through a camera and the machine's sensors, turns
  them into a short list of facts, and when the facts do not add up it consults welding
  knowledge to rank explanations and suggest what to do.
- **What is neural?** The two "sentinel" blocks that read the photo and the traces.
- **What is symbolic?** The knowledge graph, the WPS rule, the hypothesis cards.
- **Why both?** Scene 4's two lines; Scene 6's "not present in the pixels".
- **Why does disagreement trigger reasoning?** Scene 5: the simplest story predicts two
  abnormal readings; only one is abnormal.
- **What does it enable that a classifier cannot?** Scene 8: WHY and what to do next;
  Scene 9: memory across welds.

## Visual notes fixed in the polish pass

- Minimum mono label size raised to 13 px; card body text 15–23 px; graph node labels 13/17 px.
- Scene 6 edge-description callout moved out of the graph area (was overlapping nodes).
- Scene 10 cards given minimum height so the lower half of the frame is not empty.
- Scene 8 explanation card appears earlier (5.0 s instead of 5.6 s into the scene).
- UNDERCUT node sub-label removed (crossed by edges).

## Open items for the user

1. Whether to name the LLM role in the slow layer inside the video body (currently only
   "retrieved text" is named) or keep it in the provenance file.
2. Whether the illustrative identifiers (W017, Station 04, A1024, B087, WPS-014) should be
   replaced by the real part number on screen.
3. Whether to show the Intel baseline VLM's "Spatter" answer as a measured baseline in a
   future version once more than three welds have been run.
