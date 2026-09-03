# Reference analysis — how strong CV project demos show a model working

Compiled 2026-09-02 for the WELDER hero-video redesign. Twenty-two projects were studied from
their own demo media (MP4 / GIF / hero clips downloaded, frames extracted with ffmpeg, viewed);
page text was used only for labels. Per-reference answers to the ten questions are in
`reference_notes/` (`segmentation.md`, `tracking.md`, `reasoning.md`, `pages.md`). This file is
the synthesis and the visual grammar WELDER takes from it. The rulebook itself is
`visual_grammar.md`.

## 1. What was studied

| Group | References (venue) | Media actually viewed |
|---|---|---|
| Detection / segmentation | Grounded SAM 2 + Grounded-Segment-Anything; SAM 2 (Meta); Grounding DINO; SEEM (NeurIPS 2023) | intro MP4, tracking MP4s, hero and section clips, README GIFs, static figures |
| Video / tracking | Cutie (CVPR 2024 Highlight); MASA (CVPR 2024 Highlight); CoTracker (ECCV 2024); OmniMotion (ICCV 2023 Oral); XMem | 142 s demo, 2-min teaser, comparison strips, loops |
| Reasoning / embodied / industrial | ReKep (CoRL 2024); VoxPoser (CoRL 2023); ViperGPT (ICCV 2023); YAY Robot (RSS 2024); DriveVLM (CoRL 2024); AnomalyGPT (AAAI 2024); notes on PaLM-E, RT-2, Hume, VisProg | teasers, split-screen demos, chat screenshots |
| Project-page heroes | Nerfies; LERF; Instant-NGP; DINOv2; DUSt3R (CVPR 2024); 3D Gaussian Splatting; Depth Anything V1/V2; Marigold (CVPR 2024 oral); SAM 2; VGGT (CVPR 2025 best paper); MegaSaM (CVPR 2025) | autoplay heroes, teasers, narrated videos |

## 2. The ten questions, answered across the corpus

**1. What occupies most of the frame?** The data. Footage fills 100 % of the frame in every
demo clip (Cutie, MASA, CoTracker, OmniMotion, SEEM, Grounded SAM 2, SAM 2 sections, LERF,
3DGS, ReKep, YAY, DriveVLM). Where elements float, they float on a white canvas (VGGT, DUSt3R
GIF, Depth Anything, Nerfies, ViperGPT teaser). The model itself appears at most as a stroked
circle with a name (ReKep, VoxPoser) or a small code card (ViperGPT); never as a centred
diagram. The only dark UI ground is Meta's product hero.

**2. How quickly is the input shown?** Immediately, and briefly. Raw data precedes the first
model output by 0 s (MASA cold open, Grounded SAM 2, DINOv2, Nerfies), 0.5–0.8 s (SAM 2,
CoTracker, OmniMotion), 1.5 s (Cutie), 2–3 s (LERF, SAM 2 hero) — never more than ~4 s (VGGT).
Nobody introduces the input with text.

**3. How is inference visualised?** Rarely as a process. Four devices recur: (a) *one gesture* —
a click disc lands, the mask fills in ~0.3 s, the marker lingers ~1 s (SAM 2); (b)
*accumulation* — a trail grows frame by frame (CoTracker, OmniMotion), a trace or code line is
written (ViperGPT); (c) *persistence* — the same colour stays on the same object through
occlusion and cuts (Cutie, MASA, SEEM); (d) *time as proof* — a counter ticks while the output
converges (Instant-NGP), an arrow carries "0.51 s" (VGGT), an FPS HUD (3DGS). Reasoning
specifically is drawn as geometry on the scene: a line between two keypoints with one word
(ReKep), a value map painted over the scene (VoxPoser), a highlighted clause producing a crop
and a substituted number (ViperGPT, VisProg).

**4. How are overlays drawn?** One hue per instance carried across box, mask and label.
Fills 50–70 % (SAM 2 60–70, Cutie 60–70, Grounded 50–60, MASA 50) so texture reads through;
outlines 1–2 px of the same hue; boxes 2 px; labels one lowercase word in white on a solid chip
of the hue, outside the top-left of the box (Grounded) or at the mask centroid (SEEM). Trails
~3 px with a ~6 px head dot; colour by one rule (identity, or initial position), never a
legend; a second attribute changes the glyph (OmniMotion's "+" for occluded).

**5. How much text is visible at once?** Zero to ten words. SAM 2 hero, DINOv2, CoTracker,
OmniMotion: 0. LERF: 2. VGGT: 4. Instant-NGP: 5. Depth Anything: 7. Nerfies: 9. Cutie: one
stamp word. Grounded SAM 2 / MASA: a title over the working footage for ≤ 4 s, then one word per
object. Sentences appear only on title slates (narrated videos) or on the HTML page. The most
dashboard-like reference (DriveVLM) is the one with 6–8 panel fields plus two captions.

**6. Are cards or panels used?** Not over data. Cards appear as (i) footage cards in a
depth-of-field gallery (SAM 2 hero), (ii) thumbnails that accumulate finished reasoning steps
(ReKep), (iii) a single small code card (ViperGPT). Text cards, rounded panels with shadows,
tinted header chips and captioned grids appear only in paper figures (Grounding DINO) and
narrated method slides (DUSt3R) — the slide vocabulary.

**7. How are transitions handled?** Hard cuts (Grounded SAM 2 verified at 30 fps: no dissolve
frames; MASA ~5 s shots; Depth Anything ~7 s) or one continuous camera move within the same
data (SAM 2's 1.2 s card dolly, ReKep's darken → point cloud → push-in, MegaSaM's shrink-to-
corner, Cutie's diagonal wipe between views of one clip, LERF's desaturate + push-in).
Crossfades between compositions and sliding text occur only in product or architecture clips.

**8. When is architecture shown?** Never in an autoplay hero. When it exists it is a separate
clip after the demo (SAM 2 design, 32 s, real thumbnails playing inside the blocks), a static
README PNG with the real photo between blocks (Grounded SAM 2), or a ≤ 5 s recap of thumbnails
flowing into one box after the steps were watched (ReKep). In narrated videos it appears at
14–90 s as a labelled block diagram, which is the moment those videos become decks.

**9. What separates a demo from a PowerPoint?** Every pixel is data; the overlay moves with
the object; labels are stamps attached to things, not captions about them; the "reveal" is a
wipe or a fill over the same footage, not a new slide; the output is proven by what it enables
(Cutie's logo behind a dancer, MASA feeding SAM, DriveVLM's speedometer dropping); the human is
in frame and the caption colour says who is speaking (YAY); nothing is centred, boxed or
bulleted; something is always in motion while text is static.

**10. What transfers to WELDER?** Ranked across all four groups:

1. **Signal as trail** (CoTracker, OmniMotion): the four process channels written left to right
   in ink, ~3 px with a head dot, over or beside the real footage, no axis boxes.
2. **One gesture, one fill** (SAM 2, Grounded SAM 2, SEEM): raw photo ≤ 2 s → marker on the toe →
   the undercut region fills at ~55 % with a 2 px outline over 0.3 s → one-word chip.
3. **Raw is ink, findings are colour** (CoTracker grayscale rule, LERF desaturate): the model's
   output is the only colour on screen.
4. **Reasoning as lines on the data** (ReKep, ViperGPT, VisProg): each hypothesis is a line from
   a cause word to its evidence region; the check is the substituted value (`279 A ∉ [119, 182] A`);
   the verdict is the line's state (solid / dotted / dashed-fading); the winner saturates
   (Hume); finished steps stay.
5. **Hand-off by camera move, not by slide** (MegaSaM, ReKep): the photo shrinks to the top,
   the trace rises from below, the same layout carries scenes 4–6.
6. **Output proven by consequence** (Cutie, DriveVLM ring, YAY): the window drawn on the trace;
   the next weld's real trace inside it; the next weld's real photo without a groove; the
   recommendation as one caption-bar sentence whose colour says who is speaking.
7. **Words as stamps** (Cutie, MASA): `fast layer` / `slow layer` top-left; one word per chip;
   the title at the end only (autoplay-loop convention).
8. **Recap with real thumbnails, never a block diagram** (ReKep, SAM 2 design).

## 3. What WELDER must not do (seen in the same repositories)

- Gradio / GUI screen recordings where the image is 13 % of the frame (Grounded-Segment-Anything,
  Cutie GUI) — the animated-dashboard failure.
- Four panels around a logo with typed status text (PaLM-E); bilingual output panels and scene
  banners (DriveVLM); a chat transcript with an anomaly map beside the image (AnomalyGPT).
- Title / author cards, "Forward pass" boxes and stepping block diagrams (DUSt3R, 3DGS, MegaSaM).
- Tinted header chips, grey caption plates, captioned grids, 10–12 px labels (Grounding DINO
  figure, Depth Anything V2 preview, Grounded SAM 2 grids).
- Effects reels, kinetic typography on gradients, QR-code outros (SAM 2 effects, MASA outro).
- Drawing nothing at all and narrating with captions (RT-2).

## 4. WELDER's visual grammar (summary — the binding rules are in `visual_grammar.md`)

- Near-white ground `#FAFAF8` or the footage itself; no dark UI ground.
- One dominant object per scene; real data ≥ 80 % of the frame; no cards, panels or shadows.
- Raw data in ink; model findings in colour: fast layer orange `#E8590C`, slow layer blue
  `#1F5FBF`; verdicts by glyph (solid / dotted / dashed-fading), never by a third hue.
- The model acts within 2 s; inference is one gesture; accumulation stays on screen.
- Hard cuts or one continuous camera move; no crossfades between compositions.
- ≤ 8 words on the frame; one sentence in the whole video; chips 26 px, stamps 28 px,
  captions 44 px, all Inter; no latency numbers, confidences or percentages.
- No architecture diagram; the recap uses the real thumbnails; the title comes last.
- First and last shots: real data, no overlay.

## 5. How the seven scenes use these ideas

| # | Scene | Dominant object | Device borrowed |
|---|---|---|---|
| 1 | Welding + live process sensing | real arc video, full bleed | signal-as-trail (CoTracker); zero words (DINOv2) |
| 2 | Fast process inference | the four traces, ink on white | band + substituted value (SEEM scribble, VisProg); stamp (Cutie) |
| 3 | Post-weld visual inference | real photo, push-in on the bead | click → fill cadence (SAM 2); chip-above-region (Grounded) |
| 4 | Fast-flow disagreement | photo above, trace below | shrink hand-off (MegaSaM); line with one word (ReKep); hue change = layer change |
| 5 | Neural-symbolic reasoning | same layout; cause words between | lines to evidence (ReKep); substituted checks (ViperGPT); winner saturates (Hume) |
| 6 | Root cause → welder training | same layout; window on the trace | ring on the gauge (DriveVLM); caption bar (YAY); next weld's real data (Cutie consequence) |
| 7 | Research vision | real thumbnails in a loop; then the title | thumbnail recap (ReKep); title last (MASA) |
