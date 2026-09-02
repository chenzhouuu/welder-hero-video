import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {ActionCard} from '../components/Cards';
import {Body, Kicker, ProvenanceTag, Title} from '../components/Text';
import {colors} from '../styles/tokens';
import {fadeIn} from '../lib/anim';

export const DUR_10 = 252;

/** Scene 10 — accumulated reasoning becomes support for people and process. */
export const HumanFeedback: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell duration={DUR_10} temperature={0.7}>
      <div style={{position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>human-centred feedback</Kicker>
        <Title size={40} style={{opacity: fadeIn(frame, 8)}}>
          From reasoning to action.
        </Title>
        <div style={{marginLeft: 12, opacity: fadeIn(frame, 20)}}>
          <ProvenanceTag kind="intended" />
        </div>
      </div>

      <div style={{position: 'absolute', left: 96, right: 96, top: 180, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36}}>
        <ActionCard
          title="recurring pattern"
          accent={colors.neural}
          appear={fadeIn(frame, 12)}
          width={846}
          style={{minHeight: 250}}
          tag="from memory"
          lines={['Undercut cases with current above the WPS window and a stable arc', 'Same joint, same material, same cell, seven sessions']}
        />
        <ActionCard
          title="process improvement"
          accent={colors.symbolic}
          appear={fadeIn(frame, 46)}
          width={846}
          style={{minHeight: 250}}
          tag="kb-v1 remedy · REDUCE WELDING CURRENT"
          lines={['Verify the programmed current against WPS-014 before the next batch', 'Reduce welding current; re-qualify the parameter set for 7 mm Fe410 fillets']}
        />
        <ActionCard
          title="operator support"
          accent={colors.supported}
          appear={fadeIn(frame, 80)}
          width={846}
          style={{minHeight: 250}}
          tag="likely training focus · conditional on H2–H4"
          lines={['Parameter set-up and WPS adherence at the station', 'Work-angle and travel consistency, once H4 is confirmed by added sensing']}
        />
        <ActionCard
          title="inspection"
          accent={colors.plausible}
          appear={fadeIn(frame, 114)}
          width={846}
          style={{minHeight: 250}}
          tag="kb-v1 · ISO 5817 / AWS D1.1"
          lines={['Gauge toe-groove depth before release', 'Limits: 0.5 mm stringent · 1 mm moderate (ISO 5817, t > 3 mm) · 1 mm (AWS D1.1)']}
        />
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 100, display: 'flex', gap: 40, alignItems: 'baseline', opacity: fadeIn(frame, 150)}}>
        <Kicker size={16} color={colors.supported}>
          operator support
        </Kicker>
        <Kicker size={16} color={colors.symbolic}>
          process improvement
        </Kicker>
        <Kicker size={16} color={colors.symbolicSoft}>
          continuous learning
        </Kicker>
      </div>
      <div style={{position: 'absolute', right: 96, bottom: 100, textAlign: 'right', opacity: fadeIn(frame, 180)}}>
        <Body size={20} color={colors.text}>
          No worker rankings. No individual scores.
        </Body>
        <Body size={16} color={colors.textDim}>
          Feedback is attached to the process and the parameter set, not to a person.
        </Body>
      </div>
    </SceneShell>
  );
};
