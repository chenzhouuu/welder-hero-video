import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {KnowledgeGraph, GNode, GEdge} from '../components/KnowledgeGraph';
import {ObservationToken} from '../components/ObservationToken';
import {RuleCard, Panel} from '../components/Cards';
import {Body, Kicker, ProvenanceTag, Title} from '../components/Text';
import {CASE, PLATEAU_A, VOLT_MEAN, WINDOW_A} from '../data/case';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_06 = 342;

// kb-v1 subgraph around UNDERCUT (labels verbatim entity titles, shortened where noted)
export const KB_NODES: GNode[] = [
  {id: 'UNDERCUT', label: 'UNDERCUT', x: 640, y: 400, kind: 'defect'},
  {id: 'CUR', label: 'WELDING CURRENT', x: 250, y: 190, kind: 'cause'},
  {id: 'TRV', label: 'TRAVEL SPEED TOO FAST', x: 190, y: 340, kind: 'cause'},
  {id: 'VOL', label: 'EXCESSIVE VOLTAGE', x: 210, y: 490, kind: 'cause'},
  {id: 'ARC', label: 'EXCESSIVE ARC LENGTH', x: 300, y: 630, kind: 'cause'},
  {id: 'ANG', label: 'INCORRECT GUN ANGLE', x: 520, y: 130, kind: 'cause'},
  {id: 'TEC', label: 'POOR WELDER TECHNIQUE', x: 830, y: 130, kind: 'cause'},
  {id: 'PRS', label: 'ARC PRESSURE', x: 560, y: 680, kind: 'mechanism'},
  {id: 'ISO5', label: 'ISO 5817 · STRINGENT · 0.5 mm', x: 1090, y: 250, kind: 'criterion'},
  {id: 'ISO1', label: 'ISO 5817 · MODERATE · 1 mm', x: 1110, y: 390, kind: 'criterion'},
  {id: 'AWS', label: 'AWS D1.1 · LIMIT 1 mm', x: 1090, y: 530, kind: 'criterion'},
  {id: 'RCUR', label: 'REDUCE WELDING CURRENT', x: 860, y: 660, kind: 'remedy'},
  {id: 'RTRV', label: 'REDUCE TRAVEL SPEED', x: 1100, y: 680, kind: 'remedy'},
  {id: 'RANG', label: 'ANGLE TORCH TO FILL GROOVE', x: 760, y: 770, kind: 'remedy'},
  {id: 'INST', label: 'ARC INSTABILITY', x: 150, y: 770, kind: 'cause'},
];

export const KB_EDGES: GEdge[] = [
  {from: 'CUR', to: 'UNDERCUT', weight: 8, kind: 'cause'},
  {from: 'TRV', to: 'UNDERCUT', weight: 9, kind: 'cause'},
  {from: 'VOL', to: 'UNDERCUT', weight: 9, kind: 'cause'},
  {from: 'ARC', to: 'UNDERCUT', weight: 7, kind: 'cause'},
  {from: 'ANG', to: 'UNDERCUT', weight: 9, kind: 'cause'},
  {from: 'TEC', to: 'UNDERCUT', weight: 8, kind: 'cause'},
  {from: 'PRS', to: 'UNDERCUT', weight: 9, kind: 'cause'},
  {from: 'ISO5', to: 'UNDERCUT', weight: 9, kind: 'criterion'},
  {from: 'ISO1', to: 'UNDERCUT', weight: 9, kind: 'criterion'},
  {from: 'AWS', to: 'UNDERCUT', weight: 3, kind: 'criterion'},
  {from: 'RCUR', to: 'UNDERCUT', weight: 9, kind: 'remedy'},
  {from: 'RTRV', to: 'UNDERCUT', weight: 18, kind: 'remedy'},
  {from: 'RANG', to: 'UNDERCUT', weight: 9, kind: 'remedy'},
  {from: 'INST', to: 'UNDERCUT', weight: 1, kind: 'absent', label: 'no edge in kb-v1'},
];

/** Scene 6 — manufacturing knowledge enters as a typed graph. */
export const SymbolicKnowledge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const order = ['UNDERCUT', 'CUR', 'TRV', 'VOL', 'ARC', 'ANG', 'TEC', 'PRS', 'ISO5', 'ISO1', 'AWS', 'RCUR', 'RTRV', 'RANG'];
  const reveal: Record<string, number> = {};
  const edgeReveal: Record<string, number> = {};
  order.forEach((id, i) => {
    const s = 16 + i * 13;
    reveal[id] = pop(frame, fps, s);
    edgeReveal[`${id}>UNDERCUT`] = ramp(frame, s + 8, s + 26);
  });
  reveal.INST = pop(frame, fps, 288);
  edgeReveal['INST>UNDERCUT'] = ramp(frame, 296, 316);

  const edgeCUR = CASE.symbolic_knowledge.cause_edges[0];
  const linkP = ramp(frame, 214, 244);

  return (
    <SceneShell duration={DUR_06} temperature={0.9}>
      <div style={{position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>symbolic knowledge</Kicker>
        <Title size={40} style={{opacity: fadeIn(frame, 8)}}>
          Manufacturing knowledge enters.
        </Title>
        <Kicker size={12} color={colors.textDim} style={{marginLeft: 12, opacity: fadeIn(frame, 20)}}>
          WELDER-KB · kb-v1 · 4,986 entities · 9,855 relations · 45 welding documents
        </Kicker>
      </div>

      {/* observations on the left */}
      <div style={{position: 'absolute', left: 96, top: 180, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start'}}>
        <Kicker size={12} color={colors.neural} style={{opacity: fadeIn(frame, 6)}}>
          observations
        </Kicker>
        <ObservationToken k="DEFECT" v="UNDERCUT" tone="abnormal" size="md" appear={pop(frame, fps, 8)} />
        <ObservationToken k="CURRENT" v={`${PLATEAU_A.toFixed(0)} A · steady`} tone="cool" size="md" appear={pop(frame, fps, 16)} />
        <ObservationToken k="VOLTAGE" v={`${VOLT_MEAN.toFixed(1)} V · steady`} tone="cool" size="md" appear={pop(frame, fps, 24)} />
        <ObservationToken k="JOINT" v="FILLET · Fe410 · 7 mm" tone="neutral" size="md" appear={pop(frame, fps, 32)} />
      </div>

      {/* WPS rule */}
      <div style={{position: 'absolute', left: 96, top: 450, width: 440}}>
        <RuleCard title="rule · WPS-014 window" rule={`current ∈ [${WINDOW_A[0]}, ${WINDOW_A[1]}] A\nvoltage ∈ [17.5, 22.3] V`} source="window = p5–p95 of qualified good welds, same joint and material" appear={fadeIn(frame, 256)} />
      </div>

      {/* graph */}
      <div style={{position: 'absolute', left: 560, top: 150}}>
        <KnowledgeGraph nodes={KB_NODES} edges={KB_EDGES} width={1280} height={800} reveal={reveal} edgeReveal={edgeReveal} />
      </div>

      {/* links from observations into the graph */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
        <line x1={330} y1={232} x2={330 + (560 + 640 - 70 - 330) * linkP} y2={232 + (150 + 400 - 232) * linkP} stroke={colors.neural} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.9 * (linkP > 0 ? 1 : 0)} />
        <line x1={400} y1={288} x2={400 + (560 + 250 - 60 - 400) * linkP} y2={288 + (150 + 190 - 288) * linkP} stroke={colors.neural} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.9 * (linkP > 0 ? 1 : 0)} />
      </svg>

      {/* edge description callout */}
      <div style={{position: 'absolute', left: 96, top: 690, width: 440}}>
        <Panel appear={fadeIn(frame, 232)} accent={colors.symbolic} style={{padding: '12px 18px'}}>
          <div style={{display: 'flex', gap: 14, alignItems: 'baseline'}}>
            <span style={{fontFamily: fonts.mono, fontSize: 12, color: colors.symbolic, letterSpacing: '0.14em'}}>WELDING CURRENT → UNDERCUT · w{edgeCUR.weight}</span>
            <ProvenanceTag kind="kb-v1" />
          </div>
          <Body size={17} color={colors.text} style={{marginTop: 6}}>
            “{edgeCUR.text}”
          </Body>
        </Panel>
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 70, opacity: fadeIn(frame, 276)}}>
        <Title size={30} color={colors.symbolicSoft}>
          Not present in the pixels. Present in manufacturing knowledge.
        </Title>
      </div>
    </SceneShell>
  );
};
