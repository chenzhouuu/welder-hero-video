# WELDER hero video — visual grammar

Derived from `reference_analysis.md` (2026-09-02). These rules bind every scene in
`src/scenes/`. Principle: **the viewer watches the model work; nobody reads about the model.**

## Ground and frame

1. **The data is the frame.** Real footage, the real photo, or the real traces occupy ≥ 80 % of
   the frame. Nothing sits inside a card, panel, rounded container or drop shadow. Data panels
   are butted with thin white gutters when more than one is shown.
2. **Ground is footage or white.** When footage plays, the footage is the ground (the arc video
   is dark because welding is dark). Otherwise the ground is near-white `#FAFAF8`. No dark UI
   ground, no gradients, no dashboard chrome.
3. **Raw data is ink; model findings are colour.** Traces and photos are drawn without hue
   (black ink on white, light ink on footage). Only what a model has produced is coloured, so
   colour on screen always means "the model did this" (CoTracker / LERF rule).

## Colour

4. **One hue per layer, one colour rule per scene.** Fast layer (perception) = signal orange
   `#E8590C`. Slow layer (reasoning) = blue `#1F5FBF`. A finding keeps its hue across every
   representation: photo region, signal band, chip, line. Hypothesis outcome is a **glyph
   change, not a hue**: solid = supported, dotted = unverified, dashed and fading = refuted.
5. **Fills 50–60 %, outlines 2 px, bands 16–20 %.** The groove texture and the trace stay
   readable through any fill.

## Time and motion

6. **The model acts within 2 s of a scene start.** Raw data is shown untouched for ≤ 2 s.
7. **Inference is one gesture on the data.** Marker lands → fill or band fades in over ~0.3 s →
   marker lingers ~1 s → the result stays (SAM 2 cadence). No progress bars, spinners, or
   "processing" states.
8. **Accumulation is the proof.** Traces write left to right; lines are drawn, not popped;
   finished steps stay on screen.
9. **Transitions are hard cuts or one continuous camera move inside the same data** (push-in,
   shrink-to-corner hand-off, diagonal wipe between two views of the same subject). No
   crossfades between compositions, no sliding text, no zoom-in title.

## Words

10. **Budget: ≤ 1 word per mark, ≤ 12 words on the frame besides the layer stamp and finding
    chips, one sentence in the whole video** (the recommendation). Explanations live on the
    project page, not in the video.
11. **Labels are stamps and chips.** A layer stamp sits top-left (`fast layer` / `slow layer`,
    28 px). A finding chip is one word in white on a solid chip of the finding's hue, 26 px,
    anchored outside the top-left of its region, or a substituted value in ink beside a band
    (`279 A`). Caption strip text 44 px, ink on white, bottom of the frame.
12. **Numbers are measured or they do not appear.** Substituted checks (`279 A ∉ [119, 182] A`)
    use values from `src/data`. No latency figures, no confidences, no percentages.

## Structure

13. **No architecture diagram.** The final scene recaps with the real thumbnails of what was just
    watched (ReKep / SAM 2 design rule), ≤ 5 s, then the title. The title appears only at the
    end (autoplay-loop convention: open on content).
14. **Reasoning is drawn on the data.** A hypothesis is a line from a cause word to the evidence
    region (photo or trace) with the check written beside it; the verdict is the line's state.
    The knowledge graph is never shown as a graph; only the edges used for this weld appear.
15. **Output is proven by consequence.** The recommendation is shown as the next weld's real
    trace inside the window and the next weld's real photo without the groove, not as text.
16. **First and last shots are real data with no overlay.**

## The keyframe test

For every scene at its representative progress value: *if this frame were a figure on a top
CVPR project page, would it look like a model demonstration or a presentation slide?* Any frame
that fails is redesigned before its motion is polished.
