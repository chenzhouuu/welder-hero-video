import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell} from '../components/SceneShell';
import {ObservationToken} from '../components/ObservationToken';
import {Panel} from '../components/Cards';
import {Body, Kicker, ProvenanceTag, Title} from '../components/Text';
import {CASE} from '../data/case';
import history from '../data/history.json';
import {colors, fonts} from '../styles/tokens';
import {fadeIn, pop, ramp} from '../lib/anim';

export const DUR_09 = 312;

/** Scene 9 — one weld is an observation; many welds are manufacturing experience. */
export const TraceabilityMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chain: [string, string][] = [
    ['WELD', CASE.labels.weld],
    ['PART', CASE.labels.part],
    ['STATION', CASE.labels.station],
    ['OPERATOR', CASE.labels.operator],
  ];
  // chart geometry
  const W = 1080;
  const H = 470;
  const padL = 70;
  const padB = 44;
  const padT = 30;
  const yMin = 60;
  const yMax = 340;
  const y = (v: number): number => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);
  const nG = history.good.I_mean.length;
  const nU = history.undercut.I_mean.length;
  const xG = (i: number): number => padL + (i / (nG - 1)) * ((W - padL - 20) * 0.46);
  const xU = (i: number): number => padL + (W - padL - 20) * 0.52 + (i / (nU - 1)) * ((W - padL - 20) * 0.48);
  const showG = Math.floor(ramp(frame, 96, 150, 0, nG, (t) => t));
  const showU = Math.floor(ramp(frame, 150, 230, 0, nU, (t) => t));
  const win = history.window_A as [number, number];
  const stages = ['CASE', 'HISTORY', 'PATTERN', 'KNOWLEDGE'];
  return (
    <SceneShell duration={DUR_09} temperature={0.75}>
      <div style={{position: 'absolute', left: 96, top: 84, display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Kicker style={{opacity: fadeIn(frame, 4)}}>traceability and memory</Kicker>
        <Title size={40} style={{opacity: fadeIn(frame, 8)}}>
          One weld is an observation.
        </Title>
      </div>

      {/* chain */}
      <div style={{position: 'absolute', left: 96, top: 180, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0}}>
        {chain.map(([k, v], i) => (
          <React.Fragment key={k}>
            <ObservationToken k={k} v={v} tone={i === 0 ? 'abnormal' : 'neutral'} size="md" appear={pop(frame, fps, 10 + i * 14)} />
            {i < chain.length - 1 ? (
              <div style={{height: 34, width: 2, marginLeft: 28, background: colors.textDim, opacity: fadeIn(frame, 18 + i * 14, 8), transformOrigin: 'top', transform: `scaleY(${fadeIn(frame, 18 + i * 14, 8)})`}} />
            ) : null}
          </React.Fragment>
        ))}
        <div style={{marginTop: 22, width: 400}}>
          <Panel appear={fadeIn(frame, 76)} accent={colors.supported} style={{padding: '12px 16px'}}>
            <Kicker size={11} color={colors.supported}>
              case record
            </Kicker>
            <div style={{fontFamily: fonts.mono, fontSize: 16, color: colors.text, marginTop: 6, lineHeight: 1.5}}>
              UNDERCUT · lower toe
              <br />
              H2 heat input · SUPPORTED
              <br />
              I = 279 A ∉ [119, 182] A · arc stable
              <br />
              evidence links · kb-v1 edges · verdicts
            </div>
          </Panel>
        </div>
        <Kicker size={11} color={colors.textDim} style={{marginTop: 14, opacity: fadeIn(frame, 90), width: 400, letterSpacing: '0.06em'}}>
          identifiers illustrative · the dataset carries a part number only
        </Kicker>
      </div>

      {/* history chart */}
      <div style={{position: 'absolute', left: 620, top: 170, opacity: fadeIn(frame, 88)}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6}}>
          <Kicker size={13} color={colors.symbolic}>
            same cell · same joint · arc-on mean current per weld
          </Kicker>
          <ProvenanceTag kind="measured" />
        </div>
        <svg width={W} height={H} style={{overflow: 'visible'}}>
          <rect x={padL} y={padT} width={W - padL - 20} height={H - padT - padB} fill="rgba(255,255,255,0.015)" stroke={colors.panelEdge} />
          {/* window band */}
          <rect x={padL} y={y(win[1])} width={W - padL - 20} height={y(win[0]) - y(win[1])} fill={colors.symbolic} opacity={0.10} />
          <line x1={padL} x2={W - 20} y1={y(win[1])} y2={y(win[1])} stroke={colors.symbolic} strokeDasharray="4 4" opacity={0.6} />
          <line x1={padL} x2={W - 20} y1={y(win[0])} y2={y(win[0])} stroke={colors.symbolic} strokeDasharray="4 4" opacity={0.6} />
          <text x={padL + 8} y={y(win[1]) - 8} fill={colors.symbolicSoft} fontFamily={fonts.mono} fontSize={14}>
            WPS-014 window {win[0]}–{win[1]} A
          </text>
          {/* axes */}
          <g fontFamily={fonts.mono} fontSize={14} fill={colors.textDim}>
            {[100, 200, 300].map((v) => (
              <g key={v}>
                <line x1={padL - 6} x2={padL} y1={y(v)} y2={y(v)} stroke={colors.textDim} />
                <text x={padL - 10} y={y(v) + 4} textAnchor="end">
                  {v} A
                </text>
              </g>
            ))}
            <text x={xG(Math.floor(nG / 2))} y={H - 14} textAnchor="middle">
              qualified good welds · n = {nG}
            </text>
            <text x={xU(Math.floor(nU / 2))} y={H - 14} textAnchor="middle" fill={colors.neural}>
              undercut cases · n = {nU} · 7 sessions · 2023-03-15
            </text>
          </g>
          {/* good welds */}
          {history.good.I_mean.slice(0, showG).map((v, i) => (
            <circle key={`g${i}`} cx={xG(i)} cy={y(v)} r={3} fill={colors.symbolic} opacity={0.55} />
          ))}
          {/* undercut welds */}
          {history.undercut.I_mean.slice(0, showU).map((v, i) => (
            <circle key={`u${i}`} cx={xU(i)} cy={y(v)} r={i === history.hero_index_in_undercut ? 6 : 3} fill={i === history.hero_index_in_undercut ? colors.neuralHot : colors.neural} opacity={0.85} stroke={i === history.hero_index_in_undercut ? '#fff' : undefined} />
          ))}
          {showU > history.hero_index_in_undercut ? (
            <text x={xU(history.hero_index_in_undercut) + 10} y={y(history.undercut.I_mean[history.hero_index_in_undercut]) - 10} fill={colors.neuralHot} fontFamily={fonts.mono} fontSize={12}>
              this case
            </text>
          ) : null}
        </svg>
        <div style={{display: 'flex', gap: 24, marginTop: 6, opacity: fadeIn(frame, 236)}}>
          <Kicker size={12} color={colors.neural}>
            pattern · every undercut case above the window · arc as stable as a good weld
          </Kicker>
        </div>
      </div>

      {/* case → history → pattern → knowledge */}
      <div style={{position: 'absolute', left: 620, top: 740, display: 'flex', gap: 14, alignItems: 'center'}}>
        {stages.map((s, i) => {
          const a = fadeIn(frame, 200 + i * 22, 14);
          return (
            <React.Fragment key={s}>
              <div style={{padding: '10px 22px', borderRadius: 999, border: `1px solid ${colors.symbolic}`, background: `rgba(56,214,240,${0.06 + 0.18 * a})`, fontFamily: fonts.mono, fontSize: 14, letterSpacing: '0.16em', color: colors.symbolicSoft, opacity: 0.35 + 0.65 * a}}>
                {s}
              </div>
              {i < stages.length - 1 ? <span style={{color: colors.textDim, opacity: a}}>→</span> : null}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 96, bottom: 70, opacity: fadeIn(frame, 150)}}>
        <Title size={32} color={colors.symbolicSoft}>
          Repeated observations become manufacturing experience.
        </Title>
        <Body size={18} style={{marginTop: 6, opacity: fadeIn(frame, 262)}}>
          The system does not reset after every inference. Cases accumulate with their evidence and verdicts.
        </Body>
      </div>
    </SceneShell>
  );
};
