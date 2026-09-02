import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {HypothesisCard, RuleCard, EvidenceLink, Verdict} from '../components/Cards';
import {ObservationToken} from '../components/ObservationToken';
import {Kicker, ProvenanceTag, Title} from '../components/Text';
import {PLATEAU_A, PLATEAU_CV, VOLT_MEAN, VOLT_CV, FEED_MEAN, WINDOW_A} from '../data/case';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_07 = 462;

type H = {id: string; name: string; mechanism: string; predicts: string; observed: string; verdict: Verdict; evalStart: number; decide: number};

const HS: H[] = [
  {
    id: 'H1',
    name: 'Electrical instability',
    mechanism: 'unstable arc or metal transfer disturbs the pool',
    predicts: 'current and voltage fluctuate during the weld',
    observed: `plateau CV: current ${PLATEAU_CV.toFixed(3)}, voltage ${VOLT_CV.toFixed(3)} (reference ≤ 0.116) · no instability window inside the arc-on plateau · no ARC INSTABILITY → UNDERCUT edge`,
    verdict: 'WEAKENED',
    evalStart: 100,
    decide: 166,
  },
  {
    id: 'H2',
    name: 'Excessive heat input',
    mechanism: 'high arc energy melts a toe groove faster than filler refills it',
    predicts: 'current above the WPS window while the arc stays stable',
    observed: `${PLATEAU_A.toFixed(0)} A vs window ${WINDOW_A[0]}–${WINDOW_A[1]} A (rule violated) · wire feed ${FEED_MEAN.toFixed(0)} vs 41 mm/min reference · edge WELDING CURRENT → UNDERCUT (w8)`,
    verdict: 'SUPPORTED',
    evalStart: 184,
    decide: 258,
  },
  {
    id: 'H3',
    name: 'Travel speed too fast',
    mechanism: 'insufficient fill at the toe for the deposition rate',
    predicts: 'high travel speed for the given wire feed',
    observed: 'no travel-speed channel in the log · programmed 30 vs 25 cm/min for good welds · edge TRAVEL SPEED TOO FAST → UNDERCUT (w9)',
    verdict: 'PLAUSIBLE, UNVERIFIED',
    evalStart: 272,
    decide: 318,
  },
  {
    id: 'H4',
    name: 'Torch / work angle',
    mechanism: 'arc focused on the bottom plate leaves one toe unfilled',
    predicts: 'one-sided groove at the lower toe',
    observed: 'image: groove predominates at the lower toe · no angle sensor · edge INCORRECT GUN ANGLE → UNDERCUT (w9)',
    verdict: 'PLAUSIBLE, UNOBSERVED',
    evalStart: 332,
    decide: 378,
  },
];

const FINAL_ORDER = ['H2', 'H3', 'H4', 'H1'];
const CARD_X = 600;
const CARD_Y0 = 176;
const CARD_STEP = 176;
const CARD_W = 1220;

/** Scene 7 — hypotheses from the knowledge graph are tested against the observations. */
export const MechanismReasoning: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rerank = ramp(frame, 392, 432);
  const ruleOutcome = frame >= 216 ? 'violated' : 'pending';

  // observation chip anchor points (right edge, centre y) for evidence links
  const chips: {k: string; v: string; tone: 'abnormal' | 'cool' | 'neutral'; y: number}[] = [
    {k: 'DEFECT', v: 'UNDERCUT · lower toe', tone: 'abnormal', y: 196},
    {k: 'CURRENT', v: `${PLATEAU_A.toFixed(0)} A · CV ${PLATEAU_CV.toFixed(3)}`, tone: 'cool', y: 256},
    {k: 'VOLTAGE', v: `${VOLT_MEAN.toFixed(1)} V · CV ${VOLT_CV.toFixed(3)}`, tone: 'cool', y: 316},
    {k: 'WIRE FEED', v: `${FEED_MEAN.toFixed(0)} mm/min`, tone: 'cool', y: 376},
    {k: 'TRAVEL', v: 'not sensed', tone: 'neutral', y: 436},
    {k: 'ANGLE', v: 'not sensed', tone: 'neutral', y: 496},
  ];
  const chipRight = 470;

  const cardY = (h: H, idx: number): number => {
    const finalIdx = FINAL_ORDER.indexOf(h.id);
    return CARD_Y0 + (idx + (finalIdx - idx) * rerank) * CARD_STEP;
  };

  const links: {h: H; from: number[]}[] = [
    {h: HS[0], from: [1, 2]},
    {h: HS[1], from: [1, 3]},
    {h: HS[2], from: [4]},
    {h: HS[3], from: [0, 5]},
  ];

  return (
    <SceneShell duration={DUR_07} temperature={0.95}>
      <div style={{position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>mechanism-guided reasoning</Kicker>
        <Title size={40} style={{opacity: fadeIn(frame, 8)}}>
          Why could this have happened?
        </Title>
      </div>
      <div style={{position: 'absolute', right: 96, top: 92, display: 'flex', gap: 14, alignItems: 'baseline', opacity: fadeIn(frame, 14)}}>
        <Kicker size={12} color={colors.symbolic}>
          knowledge × observations
        </Kicker>
        <span style={{color: colors.textDim}}>→</span>
        <Kicker size={12} color={colors.symbolic}>
          hypothesis testing
        </Kicker>
        <span style={{color: colors.textDim}}>→</span>
        <Kicker size={12} color={colors.supported}>
          ranked explanations
        </Kicker>
      </div>

      {/* evidence column */}
      <div style={{position: 'absolute', left: 96, top: 150}}>
        <Kicker size={12} color={colors.neural} style={{marginBottom: 12, opacity: fadeIn(frame, 6)}}>
          evidence · structured observations
        </Kicker>
      </div>
      {chips.map((c, i) => (
        <div key={c.k} style={{position: 'absolute', left: 96, top: c.y - 22}}>
          <ObservationToken k={c.k} v={c.v} tone={c.tone} size="sm" appear={pop(frame, fps, 10 + i * 6)} />
        </div>
      ))}

      {/* rule check for H2 */}
      <div style={{position: 'absolute', left: 96, top: 560, width: 380}}>
        <RuleCard title="rule check · WPS-014" rule={`I_plateau ∈ [${WINDOW_A[0]}, ${WINDOW_A[1]}] A ?`} observed={`I_plateau = ${PLATEAU_A.toFixed(0)} A`} outcome={ruleOutcome} source="window from qualified good welds" appear={fadeIn(frame, 190)} />
      </div>
      <div style={{position: 'absolute', left: 96, top: 800, width: 400, opacity: fadeIn(frame, 100), display: 'flex', flexDirection: 'column', gap: 8}}>
        <Kicker size={13} color={colors.symbolicSoft}>
          knowledge-guided reasoning · rules, graph edges, retrieved text
        </Kicker>
        <Kicker size={13} color={colors.textDim}>
          not free-form chain-of-thought: every step is an inspectable artefact — observation, rule, edge, verdict
        </Kicker>
      </div>

      {/* evidence links */}
      {links.map(({h, from}) =>
        from.map((ci) => {
          const idx = HS.indexOf(h);
          const y = cardY(h, idx) + 70;
          return <EvidenceLink key={`${h.id}-${ci}`} x1={chipRight} y1={chips[ci].y} x2={CARD_X - 6} y2={y} progress={ramp(frame, h.evalStart, h.evalStart + 22)} color={h.verdict === 'WEAKENED' && frame > h.decide ? colors.weakened : colors.neural} />;
        }),
      )}

      {/* hypothesis cards */}
      {HS.map((h, i) => {
        const decided = frame >= h.decide;
        const verdict: Verdict = decided ? h.verdict : 'PENDING';
        return (
          <div key={h.id} style={{position: 'absolute', left: CARD_X, top: cardY(h, i)}}>
            <HypothesisCard id={h.id} name={h.name} mechanism={h.mechanism} predicts={h.predicts} observed={frame >= h.evalStart + 20 ? h.observed : undefined} verdict={verdict} appear={pop(frame, fps, 20 + i * 18)} evidence={fadeIn(frame, h.evalStart + 20, 12)} width={CARD_W} compact />
          </div>
        );
      })}

      {/* ranked label */}
      <div style={{position: 'absolute', left: CARD_X, top: 150, display: 'flex', gap: 18, alignItems: 'baseline'}}>
        <Kicker size={12} color={colors.symbolic} style={{opacity: 1 - rerank}}>
          candidate hypotheses · from kb-v1 cause entities
        </Kicker>
        <Kicker size={12} color={colors.supported} style={{position: 'absolute', left: 0, top: 0, opacity: rerank, whiteSpace: 'nowrap'}}>
          ranked explanations
        </Kicker>
      </div>
      <div style={{position: 'absolute', right: 96, top: 150, display: 'flex', gap: 12, alignItems: 'center', opacity: fadeIn(frame, 408)}}>
        <ProvenanceTag kind="model output" />
        <span style={{fontFamily: fonts.mono, fontSize: 12, color: colors.textDim, letterSpacing: '0.1em'}}>rank order agrees with the WELDER-CoE teacher record · verifier pass</span>
      </div>
    </SceneShell>
  );
};
