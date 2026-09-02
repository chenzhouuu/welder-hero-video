import heroCase from './hero-case.json';
import heroSignals from './hero-signals.json';

export type Hypothesis = {
  id: string;
  name: string;
  mechanism: string;
  predicts: string;
  evidence: string;
  verdict: 'WEAKENED' | 'SUPPORTED' | 'PLAUSIBLE, UNVERIFIED' | 'PLAUSIBLE, UNOBSERVED';
};

export type CauseEdge = {source: string; type: string; weight: number; text: string};

export const CASE = heroCase;
export const SIGNALS = heroSignals as {
  part_no: string;
  sampling_s: number;
  n_rows: number;
  arc_on_rows: number[];
  t: number[];
  current_A: number[];
  voltage_V: number[];
  feed_mm_min: number[];
  gas_L_min: number[];
  pressure_bar: number[];
  wire_mm: number[];
};

export const HYPOTHESES = CASE.reasoning.candidate_hypotheses as Hypothesis[];
export const CAUSE_EDGES = CASE.symbolic_knowledge.cause_edges as CauseEdge[];
export const WINDOW_A = CASE.symbolic_context.wps_window.current_A as [number, number];
export const PLATEAU_A = CASE.neural_observations.process.current.plateau_mean_A;
export const PLATEAU_CV = CASE.neural_observations.process.current.plateau_cv;
export const VOLT_MEAN = CASE.neural_observations.process.voltage.arc_on_mean_V;
export const VOLT_CV = CASE.neural_observations.process.voltage.plateau_cv;
export const FEED_MEAN = CASE.neural_observations.process.wire_feed.arc_on_mean_mm_min;
export const GAS_MEAN = CASE.neural_observations.process.gas.arc_on_mean_L_min;

export const DISCLOSURE =
  'System vision demonstration using WELDER project data. Some reasoning and downstream capabilities illustrate intended system behavior.';
