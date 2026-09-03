import React from 'react';

/** Everything a scene needs; a scene is a pure function of these values. */
export type SceneProps = {
  /** 0 at the first frame, 1 at the last frame of the scene */
  progress: number;
  /** seconds into the scene */
  t: number;
  /** scene duration in seconds */
  dur: number;
  frame: number;
  fps: number;
  width: number;
  height: number;
};

export type Keyframe = {at: number; label: string};
/** A review anchor inside a continuous scene (seconds from the scene start). */
export type ChapterMark = {n: number; at: number; title: string; message: string};

export type SceneDef = {
  id: string;
  /** 1-based display number */
  n: number;
  title: string;
  durationSec: number;
  /** what the viewer should be able to say after this scene */
  message: string;
  /** design notes shown in Director Mode */
  notes: string[];
  /** progress values worth inspecting as static compositions */
  keyframes: Keyframe[];
  /** chapters of a continuous scene, shown as seek buttons in Director Mode */
  chapters?: ChapterMark[];
  Component: React.FC<SceneProps>;
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const framesOf = (s: SceneDef): number => Math.round(s.durationSec * FPS);
